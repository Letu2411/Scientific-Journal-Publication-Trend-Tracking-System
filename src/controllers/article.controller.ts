import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import prisma from "../lib/prisma";

const fields = [
  { id: "ai", fieldName: "Artificial Intelligence" },
  { id: "medicine", fieldName: "Digital Medicine" },
  { id: "energy", fieldName: "Energy Systems" },
  { id: "materials", fieldName: "Materials Science" },
];

const paperInclude = {
  journal: true,
  keywords: {
    include: {
      keyword: true,
    },
  },
};

type PaperWithRelations = Prisma.PaperGetPayload<{
  include: typeof paperInclude;
}>;

function toOptionalInt(value: unknown) {
  if (value === undefined || value === null || value === "") return undefined;
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : undefined;
}

function getField(fieldIdOrName: unknown) {
  const value = String(fieldIdOrName || "").toLowerCase();
  return fields.find((field) => field.id === value || field.fieldName.toLowerCase() === value);
}

function resolvePaperField(keywordNames: string[]) {
  const lowerNames = keywordNames.map((name) => name.toLowerCase());
  return (
    fields.find((field) => lowerNames.includes(field.id)) ||
    fields.find((field) => lowerNames.includes(field.fieldName.toLowerCase())) ||
    fields[0]
  );
}

function buildOrder(sort: unknown): Prisma.PaperOrderByWithRelationInput {
  switch (String(sort || "newest")) {
    case "oldest":
      return { publicationYear: "asc" };
    case "citations-desc":
      return { citationCount: "desc" };
    case "citations-asc":
      return { citationCount: "asc" };
    case "title":
      return { title: "asc" };
    case "newest":
    default:
      return { publicationYear: "desc" };
  }
}

function mapPaperToArticle(paper: PaperWithRelations) {
  const keywordNames = paper.keywords.map((item) => item.keyword.name);
  const field = resolvePaperField(keywordNames);

  return {
    id: paper.id,
    articleId: paper.id,
    title: paper.title,
    abstract: paper.abstract || "",
    journalId: paper.journalId,
    journalTitle: paper.journal?.name || "Unspecified journal",
    fieldId: field.id,
    fieldName: field.fieldName,
    publicationYear: paper.publicationYear || 0,
    publicationDate: null,
    citations: paper.citationCount,
    doi: paper.doi,
    sourceUrl: paper.sourceUrl || "",
    sourceProvider: paper.sourceProvider || "Google Scholar",
    keywords: keywordNames.join(", "),
    researcherId: paper.researcherId,
    researcherName: paper.researcherName,
    status: paper.status || "Pending",
    createdAt: paper.createdAt,
    updatedAt: paper.updatedAt,
  };
}

async function attachKeyword(paperId: string, keywordName: string) {
  const name = keywordName.trim();
  if (!name) return;

  const keyword = await prisma.keyword.upsert({
    where: { name },
    update: {},
    create: { name },
    select: { id: true },
  });

  await prisma.paperKeyword.upsert({
    where: {
      paperId_keywordId: {
        paperId,
        keywordId: keyword.id,
      },
    },
    update: {},
    create: {
      paperId,
      keywordId: keyword.id,
    },
  });
}

export const searchArticles = async (req: Request, res: Response) => {
  try {
    const {
      q,
      fieldId,
      status,
      sourceProvider,
      yearFrom,
      yearTo,
      minCitations,
      sort,
    } = req.query;

    const query = String(q || "").trim();
    const fromYear = toOptionalInt(yearFrom);
    const toYear = toOptionalInt(yearTo);
    const citationFloor = toOptionalInt(minCitations);
    const where: Prisma.PaperWhereInput = {};

    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { abstract: { contains: query, mode: "insensitive" } },
        { doi: { contains: query, mode: "insensitive" } },
        { sourceUrl: { contains: query, mode: "insensitive" } },
        { journal: { name: { contains: query, mode: "insensitive" } } },
        { keywords: { some: { keyword: { name: { contains: query, mode: "insensitive" } } } } },
      ];
    }

    if (fieldId && String(fieldId) !== "all") {
      const field = getField(fieldId);
      const fieldTerms = field ? [field.id, field.fieldName] : [String(fieldId)];
      where.keywords = {
        some: {
          keyword: {
            name: { in: fieldTerms },
          },
        },
      };
    }

    if (status && String(status) !== "all") {
      where.status = String(status);
    }

    if (sourceProvider && String(sourceProvider) !== "all") {
      where.sourceProvider = String(sourceProvider);
    }

    if (fromYear !== undefined || toYear !== undefined) {
      where.publicationYear = {
        ...(fromYear !== undefined ? { gte: fromYear } : {}),
        ...(toYear !== undefined ? { lte: toYear } : {}),
      };
    }

    if (citationFloor !== undefined) {
      where.citationCount = { gte: citationFloor };
    }

    const papers = await prisma.paper.findMany({
      where,
      orderBy: buildOrder(sort),
      include: paperInclude,
    });

    const articles = papers.map(mapPaperToArticle);

    return res.status(200).json({
      message: "Search articles successfully",
      articles,
      total: articles.length,
    });
  } catch (error: any) {
    return res.status(200).json({
      message: "Search articles returned no data because the database is unavailable",
      articles: [],
      total: 0,
      warning: error?.code === "ECONNREFUSED" ? "Database is not available" : "Database query failed",
    });
  }
};

export const createArticle = async (req: Request, res: Response) => {
  try {
    const {
      title,
      abstract,
      journalTitle,
      fieldId,
      fieldName,
      publicationYear,
      citations,
      doi,
      sourceUrl,
      sourceProvider,
      keywords,
    } = req.body;

    if (!title || !abstract || !journalTitle || !fieldId || !fieldName || !publicationYear || !sourceUrl) {
      return res.status(400).json({
        message: "title, abstract, journalTitle, fieldId, fieldName, publicationYear and sourceUrl are required",
      });
    }

    const user = (req as any).user;
    const currentUser = user?.userId
      ? await prisma.user.findUnique({
          where: { id: user.userId },
          select: { id: true, fullName: true, email: true },
        })
      : null;

    const journal = await prisma.journal.upsert({
      where: { name: String(journalTitle) },
      update: {},
      create: { name: String(journalTitle) },
      select: { id: true },
    });

    const paper = await prisma.paper.create({
      data: {
        title: String(title),
        abstract: String(abstract),
        doi: doi ? String(doi) : undefined,
        publicationYear: Number(publicationYear),
        citationCount: citations ? Number(citations) : 0,
        sourceUrl: String(sourceUrl),
        sourceProvider: sourceProvider ? String(sourceProvider) : "Google Scholar",
        status: "Pending",
        researcherId: currentUser?.id || user?.userId,
        researcherName: currentUser?.fullName || user?.email || "Current user",
        journalId: journal.id,
      },
      include: paperInclude,
    });

    await attachKeyword(paper.id, String(fieldId));
    await attachKeyword(paper.id, String(fieldName));

    const keywordList = Array.isArray(keywords)
      ? keywords
      : String(keywords || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);

    for (const keyword of keywordList) {
      await attachKeyword(paper.id, String(keyword));
    }

    const createdPaper = await prisma.paper.findUnique({
      where: { id: paper.id },
      include: paperInclude,
    });

    return res.status(201).json({
      message: "Create article successfully",
      article: createdPaper ? mapPaperToArticle(createdPaper) : mapPaperToArticle(paper),
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Article DOI already exists",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};

export const updateArticleStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["Pending", "Approved", "Rejected"];

    if (!allowedStatuses.includes(String(status))) {
      return res.status(400).json({
        message: "status must be Pending, Approved or Rejected",
      });
    }

    const paper = await prisma.paper.update({
      where: { id: String(req.params.articleId) },
      data: { status: String(status) },
      include: paperInclude,
    });

    return res.status(200).json({
      message: "Update article status successfully",
      article: mapPaperToArticle(paper),
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};
