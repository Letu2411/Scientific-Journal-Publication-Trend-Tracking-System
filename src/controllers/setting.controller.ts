import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getSettings = async (req: Request, res: Response) => {
  try {
    const settings = await prisma.systemSetting.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      message: "Get settings successfully",
      settings,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};

export const getSettingByKey = async (req: Request, res: Response) => {
  try {
    const key = String(req.params.key);

    const setting = await prisma.systemSetting.findUnique({
      where: { key },
    });

    if (!setting) {
      return res.status(404).json({
        message: "Setting not found",
      });
    }

    return res.status(200).json({
      message: "Get setting successfully",
      setting,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};

export const createSetting = async (req: Request, res: Response) => {
  try {
    const { key, value, description } = req.body;

    if (!key || value === undefined) {
      return res.status(400).json({
        message: "key and value are required",
      });
    }

    const settingKey = String(key);

    const existingSetting = await prisma.systemSetting.findUnique({
      where: { key: settingKey },
    });

    if (existingSetting) {
      return res.status(409).json({
        message: "Setting key already exists",
      });
    }

    const setting = await prisma.systemSetting.create({
      data: {
        key: settingKey,
        value: String(value),
        description: description ? String(description) : undefined,
      },
    });

    return res.status(201).json({
      message: "Create setting successfully",
      setting,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};

export const updateSetting = async (req: Request, res: Response) => {
  try {
    const key = String(req.params.key);
    const { value, description } = req.body;

    const existingSetting = await prisma.systemSetting.findUnique({
      where: { key },
    });

    if (!existingSetting) {
      return res.status(404).json({
        message: "Setting not found",
      });
    }

    const setting = await prisma.systemSetting.update({
      where: { key },
      data: {
        value: value !== undefined ? String(value) : existingSetting.value,
        description:
          description !== undefined ? String(description) : existingSetting.description,
      },
    });

    return res.status(200).json({
      message: "Update setting successfully",
      setting,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};

export const deleteSetting = async (req: Request, res: Response) => {
  try {
    const key = String(req.params.key);

    const existingSetting = await prisma.systemSetting.findUnique({
      where: { key },
    });

    if (!existingSetting) {
      return res.status(404).json({
        message: "Setting not found",
      });
    }

    await prisma.systemSetting.delete({
      where: { key },
    });

    return res.status(200).json({
      message: "Delete setting successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};