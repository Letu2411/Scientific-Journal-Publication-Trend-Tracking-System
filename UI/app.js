// ============ API CONFIGURATION ============
const API_BASE_URL = "http://localhost:8080/api";
let authToken = localStorage.getItem("authToken");

async function apiCall(endpoint, method = "GET", body = null) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    }
  };

  if (authToken) {
    options.headers["Authorization"] = `Bearer ${authToken}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API Error");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// ============ AUTHENTICATION STATE ============
let currentUser = null;
const registeredUsers = [];  // Will be populated from backend
let users = [
  { userId: "U-201", name: "Dr. Minh Nguyen", email: "minh.nguyen@scipub.test", role: "Researcher", status: "Active", researcherAccess: "Approved" },
  { userId: "U-301", name: "Linh Tran", email: "linh.tran@scipub.test", role: "User", status: "Active", researcherAccess: "Pending" },
  { userId: "U-401", name: "Bao Pham", email: "bao.pham@scipub.test", role: "Admin", status: "Active", researcherAccess: "Approved" },
  { userId: "U-402", name: "An Le", email: "an.le@scipub.test", role: "User", status: "Active", researcherAccess: "None" }
];

// ============ APPLICATION DATA ============
const fields = [
  { id: "ai", fieldName: "Artificial Intelligence", description: "Models, automation, and research intelligence", momentum: 96 },
  { id: "medicine", fieldName: "Digital Medicine", description: "Clinical systems, diagnostics, and patient monitoring", momentum: 84 },
  { id: "energy", fieldName: "Energy Systems", description: "Storage, renewables, and grid optimization", momentum: 78 },
  { id: "materials", fieldName: "Materials Science", description: "Advanced materials and manufacturing", momentum: 72 }
];

const journals = [
  {
    journalId: "J-1001",
    title: "Journal of Research Analytics",
    fieldId: "ai",
    impactFactor: 9.8,
    articles: [
      { articleId: "A-4401", title: "Mapping foundation model adoption in scientific workflows", publicationDate: "2026-03-14", citations: 1284, authorId: "U-201" },
      { articleId: "A-4402", title: "Topic emergence detection across publication graphs", publicationDate: "2025-11-22", citations: 816, authorId: "U-204" }
    ]
  },
  {
    journalId: "J-1002",
    title: "Clinical Intelligence Review",
    fieldId: "medicine",
    impactFactor: 8.4,
    articles: [
      { articleId: "A-5120", title: "Clinical decision support systems in regional hospitals", publicationDate: "2026-01-18", citations: 642, authorId: "U-209" },
      { articleId: "A-5121", title: "Biomedical knowledge graphs for personalized oncology", publicationDate: "2025-08-09", citations: 731, authorId: "U-210" }
    ]
  },
  {
    journalId: "J-1003",
    title: "Energy Systems Review",
    fieldId: "energy",
    impactFactor: 7.6,
    articles: [
      { articleId: "A-6302", title: "A bibliometric view of clean energy storage", publicationDate: "2026-02-05", citations: 972, authorId: "U-214" },
      { articleId: "A-6303", title: "Green hydrogen systems and citation acceleration", publicationDate: "2025-09-17", citations: 584, authorId: "U-215" }
    ]
  },
  {
    journalId: "J-1004",
    title: "Advanced Materials Trends",
    fieldId: "materials",
    impactFactor: 7.1,
    articles: [
      { articleId: "A-7101", title: "Self-healing polymers in industrial research", publicationDate: "2026-04-02", citations: 511, authorId: "U-221" },
      { articleId: "A-7102", title: "High-entropy alloys across multidisciplinary teams", publicationDate: "2025-12-01", citations: 468, authorId: "U-222" }
    ]
  }
];

const trendData = [
  { date: "2022", fieldId: "ai", publicationCount: 118000, citationCount: 420000 },
  { date: "2023", fieldId: "ai", publicationCount: 138000, citationCount: 552000 },
  { date: "2024", fieldId: "ai", publicationCount: 169000, citationCount: 740000 },
  { date: "2025", fieldId: "ai", publicationCount: 219000, citationCount: 1120000 },
  { date: "2026", fieldId: "ai", publicationCount: 248930, citationCount: 1485000 },
  { date: "2026", fieldId: "medicine", publicationCount: 182400, citationCount: 960000 },
  { date: "2026", fieldId: "energy", publicationCount: 154800, citationCount: 782000 },
  { date: "2026", fieldId: "materials", publicationCount: 137900, citationCount: 688000 }
];

let savedSearches = [
  { id: "S-01", query: "field:Artificial Intelligence impactFactor > 8", owner: "U-201", status: "Active" },
  { id: "S-02", query: "citations > 900 publicationDate:2026", owner: "U-201", status: "Active" },
  { id: "S-03", query: "field:Energy Systems trend:growing", owner: "U-201", status: "Completed" }
];

let submittedArticles = [
  {
    articleId: "SUB-001",
    title: "Researcher workflow adoption in cross-field publication tracking",
    journalId: "J-1001",
    fieldId: "ai",
    researcherId: "U-201",
    researcherName: "Dr. Minh Nguyen",
    abstract: "A study of workflow signals across journal analytics platforms.",
    status: "Pending"
  },
  {
    articleId: "SUB-002",
    title: "Clinical dashboards for citation-aware decision support",
    journalId: "J-1002",
    fieldId: "medicine",
    researcherId: "U-201",
    researcherName: "Dr. Minh Nguyen",
    abstract: "A short submission for administrative review.",
    status: "Approved"
  }
];

// ============ THEME + I18N ============
const themeToggleBtn = document.querySelector("#themeToggle");
const languageSelect = document.querySelector("#languageSelect");

const i18n = {
  en: {
    userName: "User",
    logoutBtn: "Logout",
    themeToggleLight: "Light",
    themeToggleDark: "Dark",

    topEyebrow: "Scientific Journal Publication Trend Tracking System",
    pageTitle: "Research intelligence workspace",

    heroEyebrow: "UML-driven interface",
    heroTitle:
      "Track journals, articles, fields, researcher approvals, article submissions, and publication trends in one workflow.",
    heroSearch: "Search Journals",
    heroReport: "Generate Report",

    viewDashboard: "Research intelligence workspace",

    accessTitleReader: "Reader account",
    accessDescReader:
      "You can read dashboards, inspect journal details, and search publication data.",
    accessTitleResearcher: "Researcher account",
    accessDescResearcher:
      "Researcher access is approved. Saved searches and article submission are unlocked.",
    accessTitlePending: "Researcher request pending",
    accessDescPending:
      "Admin is reviewing your request. Posting features unlock after approval.",
    requestResearcherButton: "Request Researcher Access",

    metricTotalJournals: "Total Journals",
    metricArticlesTracked: "Articles Tracked",
    metricCitations: "Citations",
    metricSavedSearches: "Saved Searches",

    searchLabelSearchJournals: "Search Journals",
    searchLabelResults: "Journal results",
    searchHintPlaceholder: "Search by title, field, or keyword",
    filterAllFields: "All fields",
    saveSearchButton: "Save Search",

    viewJournalDetailsEyebrow: "View Journal Details",
    selectJournal: "Select a journal",

    trendsEyebrow: "TrendData",
    trendsTitle: "Field comparison",
    reportButton: "Generate Custom Report",

    savedEyebrow: "Researcher.savedSearches",
    savedTitle: "Saved searches",
    clearSavedButton: "Clear Completed",

    postsEyebrow: "Researcher.articleSubmissions",
    postsTitle: "Submit an article",
    postTitleLabel: "Article title",
    postTitlePlaceholder: "Enter article title",
    journalLabel: "Journal",
    fieldLabel: "Field",
    abstractLabel: "Abstract",
    abstractPlaceholder: "Short abstract for admin review",
    submitForReview: "Submit for Review",
    myArticlesEyebrow: "My Articles",
    submissionStatus: "Submission status",

    editorEyebrow: "Editor.assignedJournals",
    editorTitle: "Manage journals",
    assignJournalButton: "Assign Journal",

    adminEyebrow: "Administration Panel",
    adminTitle: "System Management & User Control Center",
    addUserButton: "+ Add New User",
    refreshStatsButton: "Refresh Stats",

    userManagementEyebrow: "User Management",
    allRegisteredUsers: "All registered users",
    adminUserSearchPlaceholder: "Search by name or email",

    modalAddUserTitle: "Add New User",
    modalEditUserTitle: "Edit User",

    fullNameLabel: "Full Name",
    fullNamePlaceholder: "User full name",
    emailLabel: "Email Address",
    emailPlaceholder: "user@example.com",
    roleLabel: "Role",
    statusLabel: "Status",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter password",
    passwordHintNew: "Required for new users",
    passwordHintKeep: "Leave empty to keep existing password",

    saveUserButton: "Save User",
    cancelUserForm: "Cancel",

    articleManagementEyebrow: "Article Management",
    researcherSubmissionsTitle: "Researcher submissions",

    systemActivityEyebrow: "Recent Activity",
    systemActivityTitle: "System log & events",

    adminTableUserId: "User ID",
    adminTableName: "Name",
    adminTableEmail: "Email",
    adminTableRole: "Role",
    adminTableResearcherAccess: "Researcher Access",
    adminTableStatus: "Status",
    adminTableActions: "Actions",

    adminPostArticleId: "Article ID",
    adminPostTitle: "Title",
    adminPostResearcher: "Researcher",
    adminPostJournal: "Journal",
    adminPostStatus: "Status",
    adminPostActions: "Actions",

    postLockedTitle: "Posting Locked",
    postLockedDesc:
      "Only approved researchers can submit articles. Please request researcher access first.",
    postingLockedCardTitle: "Posting locked",
    postingLockedCardDesc: "Request researcher access and wait for admin approval to submit articles.",
    noSubmissionsYet: "No submissions yet",
    noSubmissionsDesc: "Submitted articles will appear here.",

    notificationStatsRefreshed: "Stats refreshed!"
  },
  vi: {
    userName: "Người dùng",
    logoutBtn: "Đăng xuất",
    themeToggleLight: "Sáng",
    themeToggleDark: "Tối",

    topEyebrow: "Hệ thống theo dõi xu hướng công bố khoa học",
    pageTitle: "Không gian nghiên cứu thông minh",

    heroEyebrow: "Giao diện dựa trên UML",
    heroTitle:
      "Theo dõi tạp chí, bài viết, lĩnh vực, phê duyệt của nhà nghiên cứu, bài nộp và xu hướng công bố trong một quy trình.",
    heroSearch: "Tìm tạp chí",
    heroReport: "Tạo báo cáo",

    viewDashboard: "Không gian nghiên cứu thông minh",

    accessTitleReader: "Tài khoản người đọc",
    accessDescReader:
      "Bạn có thể xem dashboard, xem chi tiết tạp chí và tìm dữ liệu công bố.",
    accessTitleResearcher: "Tài khoản nhà nghiên cứu",
    accessDescResearcher:
      "Quyền nhà nghiên cứu đã được phê duyệt. Đã mở khóa lưu tìm kiếm và nộp bài.",
    accessTitlePending: "Đang chờ phê duyệt",
    accessDescPending:
      "Quản trị đang xem xét yêu cầu của bạn. Tính năng nộp bài sẽ được mở sau khi phê duyệt.",
    requestResearcherButton: "Yêu cầu quyền nhà nghiên cứu",

    metricTotalJournals: "Tổng tạp chí",
    metricArticlesTracked: "Bài viết theo dõi",
    metricCitations: "Trích dẫn",
    metricSavedSearches: "Tìm kiếm đã lưu",

    searchLabelSearchJournals: "Tìm tạp chí",
    searchLabelResults: "Kết quả tạp chí",
    searchHintPlaceholder: "Tìm theo tiêu đề, lĩnh vực hoặc từ khóa",
    filterAllFields: "Tất cả lĩnh vực",
    saveSearchButton: "Lưu tìm kiếm",

    viewJournalDetailsEyebrow: "Xem chi tiết tạp chí",
    selectJournal: "Chọn một tạp chí",

    trendsEyebrow: "TrendData",
    trendsTitle: "So sánh theo lĩnh vực",
    reportButton: "Tạo báo cáo tùy chỉnh",

    savedEyebrow: "Researcher.savedSearches",
    savedTitle: "Tìm kiếm đã lưu",
    clearSavedButton: "Xóa hoàn thành",

    postsEyebrow: "Researcher.articleSubmissions",
    postsTitle: "Nộp một bài",
    postTitleLabel: "Tiêu đề bài",
    postTitlePlaceholder: "Nhập tiêu đề bài",
    journalLabel: "Tạp chí",
    fieldLabel: "Lĩnh vực",
    abstractLabel: "Tóm tắt",
    abstractPlaceholder: "Tóm tắt ngắn để quản trị xem xét",
    submitForReview: "Nộp để duyệt",
    myArticlesEyebrow: "Bài của tôi",
    submissionStatus: "Trạng thái nộp bài",

    editorEyebrow: "Editor.assignedJournals",
    editorTitle: "Quản lý tạp chí",
    assignJournalButton: "Gán tạp chí",

    adminEyebrow: "Bảng quản trị",
    adminTitle: "Quản lý hệ thống & Trung tâm kiểm soát người dùng",
    addUserButton: "+ Thêm người dùng",
    refreshStatsButton: "Làm mới thống kê",

    userManagementEyebrow: "Quản lý người dùng",
    allRegisteredUsers: "Tất cả người dùng đã đăng ký",
    adminUserSearchPlaceholder: "Tìm theo tên hoặc email",

    modalAddUserTitle: "Thêm người dùng mới",
    modalEditUserTitle: "Chỉnh sửa người dùng",

    fullNameLabel: "Họ và tên",
    fullNamePlaceholder: "Tên đầy đủ của người dùng",
    emailLabel: "Email",
    emailPlaceholder: "user@example.com",
    roleLabel: "Vai trò",
    statusLabel: "Trạng thái",
    passwordLabel: "Mật khẩu",
    passwordPlaceholder: "Nhập mật khẩu",
    passwordHintNew: "Bắt buộc cho người dùng mới",
    passwordHintKeep: "Để trống để giữ mật khẩu hiện tại",

    saveUserButton: "Lưu người dùng",
    cancelUserForm: "Hủy",

    articleManagementEyebrow: "Quản lý bài viết",
    researcherSubmissionsTitle: "Bài nộp của nhà nghiên cứu",

    systemActivityEyebrow: "Hoạt động gần đây",
    systemActivityTitle: "Nhật ký hệ thống & sự kiện",

    adminTableUserId: "Mã người dùng",
    adminTableName: "Tên",
    adminTableEmail: "Email",
    adminTableRole: "Vai trò",
    adminTableResearcherAccess: "Quyền nhà nghiên cứu",
    adminTableStatus: "Trạng thái",
    adminTableActions: "Hành động",

    adminPostArticleId: "Mã bài",
    adminPostTitle: "Tiêu đề",
    adminPostResearcher: "Nhà nghiên cứu",
    adminPostJournal: "Tạp chí",
    adminPostStatus: "Trạng thái",
    adminPostActions: "Hành động",

    postLockedTitle: "Bị khóa nộp bài",
    postLockedDesc:
      "Chỉ nhà nghiên cứu đã được phê duyệt mới có thể nộp bài. Vui lòng yêu cầu quyền nhà nghiên cứu trước.",
    postingLockedCardTitle: "Đang bị khóa",
    postingLockedCardDesc: "Yêu cầu quyền nhà nghiên cứu và chờ quản trị duyệt để nộp bài.",
    noSubmissionsYet: "Chưa có bài nào",
    noSubmissionsDesc: "Các bài đã nộp sẽ hiển thị tại đây.",

    notificationStatsRefreshed: "Đã làm mới thống kê!"
  }
};

function getStoredLang() {
  return localStorage.getItem("lang") || "en";
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  if (themeToggleBtn) {
    themeToggleBtn.textContent =
      theme === "dark" ? i18n[getStoredLang()].themeToggleDark : i18n[getStoredLang()].themeToggleLight;
  }
  localStorage.setItem("theme", theme);
}

function getTheme() {
  return localStorage.getItem("theme") || "light";
}

function applyI18n() {
  const lang = getStoredLang();
  const t = i18n[lang] || i18n.en;

  const eyebrow = document.querySelector(".topbar .eyebrow");
  if (eyebrow) eyebrow.textContent = t.topEyebrow;

  if (pageTitle) pageTitle.textContent = t.pageTitle;

  const heroEyebrow = document.querySelector(".hero-band .eyebrow");
  if (heroEyebrow) heroEyebrow.textContent = t.heroEyebrow;

  const heroH2 = document.querySelector(".hero-band h2");
  if (heroH2) heroH2.textContent = t.heroTitle;

  document.querySelector("[data-view-jump='search']")?.setAttribute("aria-label", t.heroSearch);
  const searchJump = document.querySelector("[data-view-jump='search']");
  if (searchJump) searchJump.textContent = t.heroSearch;

  const trendsJump = document.querySelector("[data-view-jump='trends']");
  if (trendsJump) trendsJump.textContent = t.heroReport;

  const userNameEl = document.querySelector("[data-i18n='userName']");
  if (userNameEl) userNameEl.textContent = t.userName;

  const logoutBtnEl = document.querySelector("[data-i18n='logoutBtn']");
  if (logoutBtnEl) logoutBtnEl.textContent = t.logoutBtn;

  // Search placeholders & select options
  if (journalSearch) journalSearch.placeholder = t.searchHintPlaceholder;
  if (fieldFilter) {
    fieldFilter.innerHTML = `<option value="all">${t.filterAllFields}</option>`;
    fields.forEach((f) => {
      fieldFilter.innerHTML += `<option value="${f.id}">${f.fieldName}</option>`;
    });
  }

  if (saveSearchButton) saveSearchButton.textContent = t.saveSearchButton;

  // Access panel (depends on role; update immediately using existing function)
  // We'll set base texts used by renderAccessPanel and then call it.
  if (accessTitle && requestResearcherButton) {
    // renderAccessPanel() will override
  }

  // Buttons that are currently static in HTML
  const requestBtn = document.querySelector("#requestResearcherButton");
  if (requestBtn) requestBtn.textContent = t.requestResearcherButton;

  // Theme toggle text
  if (themeToggleBtn) {
    themeToggleBtn.textContent =
      (getTheme() === "dark" ? t.themeToggleDark : t.themeToggleLight);
  }

  // Tables & labels (only a few visible in current render)
  const adminUserSearchInput = document.querySelector("#adminUserSearch");
  if (adminUserSearchInput) adminUserSearchInput.placeholder = t.adminUserSearchPlaceholder;

  // Fix report button initial text
  if (reportButton) reportButton.textContent = t.reportButton;

  // Editor button
  const assignBtn = document.querySelector("#assignJournalButton");
  if (assignBtn) assignBtn.textContent = t.assignJournalButton;

  // Saved
  const clearSaved = document.querySelector("#clearSavedButton");
  if (clearSaved) clearSaved.textContent = t.clearSavedButton;
}

let selectedJournalId = journals[0].journalId;
let activeRole = "user";

function initI18nAndTheme() {
  // theme
  setTheme(getTheme());

  // language
  const lang = getStoredLang();
  if (languageSelect) languageSelect.value = lang;

  applyI18n();
  // re-render access texts based on role (renderAccessPanel will run inside applyRole)
  applyRole(activeRole);
}



// ============ AUTH DOM ELEMENTS ============
const authContainer = document.querySelector("#authContainer");
const appShell = document.querySelector("#appShell");
const loginForm = document.querySelector("#loginForm");
const registerForm = document.querySelector("#registerForm");
const forgotPasswordForm = document.querySelector("#forgotPasswordForm");
const loginFormElement = document.querySelector("#loginFormElement");
const registerFormElement = document.querySelector("#registerFormElement");
const forgotPasswordFormElement = document.querySelector("#forgotPasswordFormElement");
const loginEmailInput = document.querySelector("#loginEmail");
const loginPasswordInput = document.querySelector("#loginPassword");
const registerNameInput = document.querySelector("#registerName");
const registerUsernameInput = document.querySelector("#registerUsername");
const registerEmailInput = document.querySelector("#registerEmail");
const registerPasswordInput = document.querySelector("#registerPassword");
const registerConfirmPasswordInput = document.querySelector("#registerConfirmPassword");
const resetEmailInput = document.querySelector("#resetEmail");
const registerLink = document.querySelector("#registerLink");
const forgotPasswordLink = document.querySelector("#forgotPasswordLink");
const backToLoginLink = document.querySelector("#backToLoginLink");
const backToLoginLink2 = document.querySelector("#backToLoginLink2");

// Debug: Check if link elements exist
if (!registerLink) console.warn("registerLink not found");
if (!forgotPasswordLink) console.warn("forgotPasswordLink not found");
if (!backToLoginLink) console.warn("backToLoginLink not found");
if (!backToLoginLink2) console.warn("backToLoginLink2 not found");

const pageTitle = document.querySelector("#pageTitle");
const activeRoleLabel = document.querySelector("#activeRole");
const views = [...document.querySelectorAll(".view")];
const navItems = [...document.querySelectorAll("[data-view]")];
const jumpButtons = [...document.querySelectorAll("[data-view-jump]")];
const metricSelect = document.querySelector("#metricSelect");
const trendChart = document.querySelector("#trendChart");
const fieldList = document.querySelector("#fieldList");
const journalSearch = document.querySelector("#journalSearch");
const fieldFilter = document.querySelector("#fieldFilter");
const journalList = document.querySelector("#journalList");
const journalDetail = document.querySelector("#journalDetail");
const detailTitle = document.querySelector("#detailTitle");
const trendTable = document.querySelector("#trendTable");
const reportButton = document.querySelector("#reportButton");
const reportTitle = document.querySelector("#reportTitle");
const reportBody = document.querySelector("#reportBody");
const reportTopField = document.querySelector("#reportTopField");
const savedSearchList = document.querySelector("#savedSearchList");
const clearSavedButton = document.querySelector("#clearSavedButton");
const saveSearchButton = document.querySelector("#saveSearchButton");
const roleAccessPanel = document.querySelector("#roleAccessPanel");
const accessTitle = document.querySelector("#accessTitle");
const accessDescription = document.querySelector("#accessDescription");
const requestResearcherButton = document.querySelector("#requestResearcherButton");
const postFormElement = document.querySelector("#postFormElement");
const postTitleInput = document.querySelector("#postTitleInput");
const postJournalSelect = document.querySelector("#postJournalSelect");
const postFieldSelect = document.querySelector("#postFieldSelect");
const postAbstractInput = document.querySelector("#postAbstractInput");
const researcherPostList = document.querySelector("#researcherPostList");
const editorJournalList = document.querySelector("#editorJournalList");
const assignJournalButton = document.querySelector("#assignJournalButton");
const userTable = document.querySelector("#userTable");

// Safely get old userTable if exists, fallback to null
const legacyUserTable = document.querySelector("#userTable");
const addUserButton = document.querySelector("#addUserButton");

// Override renderUsers to check if element exists
const originalRenderUsers = function() {
  if (!legacyUserTable) return; // Skip if table doesn't exist in current view
  legacyUserTable.innerHTML = users
    .map((user) => {
      return `
        <tr>
          <td>${user.userId}</td>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.role}</td>
          <td>${user.status}</td>
        </tr>
      `;
    })
    .join("");
};

// ============ ADMIN DASHBOARD DOM ELEMENTS ============
const adminUserTable = document.querySelector("#adminUserTable");
const userModal = document.querySelector("#userModal");
const userFormElement = document.querySelector("#userFormElement");
const userModalTitle = document.querySelector("#userModalTitle");
const closeUserModal = document.querySelector("#closeUserModal");
const cancelUserForm = document.querySelector("#cancelUserForm");
const userFormName = document.querySelector("#userFormName");
const userFormEmail = document.querySelector("#userFormEmail");
const userFormRole = document.querySelector("#userFormRole");
const userFormStatus = document.querySelector("#userFormStatus");
const userFormPassword = document.querySelector("#userFormPassword");
const adminUserSearch = document.querySelector("#adminUserSearch");
const refreshStatsButton = document.querySelector("#refreshStatsButton");
const activityLog = document.querySelector("#activityLog");
const totalUsersMetric = document.querySelector("#totalUsersMetric");
const researcherCountMetric = document.querySelector("#researcherCountMetric");
const editorCountMetric = document.querySelector("#editorCountMetric");
const pendingPostsMetric = document.querySelector("#pendingPostsMetric");
const adminPostTable = document.querySelector("#adminPostTable");

let editingUserId = null;
let activityLogs = [
  { id: 1, event: "System initialized", user: "System", timestamp: new Date(Date.now() - 60000) },
  { id: 2, event: "Admin panel accessed", user: "Administrator", timestamp: new Date(Date.now() - 30000) }
];

function getField(fieldId) {
  return fields.find((field) => field.id === fieldId);
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function normalizeRole(role) {
  return String(role || "User").toLowerCase();
}

function getCurrentUserId() {
  return currentUser?.id || currentUser?.userId || "U-201";
}

function getCurrentUserName() {
  return currentUser?.name || "Dr. Minh Nguyen";
}

function isResearcherRole() {
  return activeRole === "researcher" || activeRole === "admin";
}

function setView(viewName) {
  const target = document.querySelector(`#${viewName}View`);
  if (!target) return;

  views.forEach((view) => view.classList.toggle("active", view === target));
  navItems.forEach((item) => item.classList.toggle("active", item.dataset.view === viewName));
  pageTitle.textContent = target.dataset.title;
}

function applyRole(role) {
  activeRole = normalizeRole(role);
  activeRoleLabel.textContent = activeRole.charAt(0).toUpperCase() + activeRole.slice(1);

  navItems.forEach((item) => {
    const rolesAttr = item.dataset.roles;
    if (!rolesAttr) return; // Skip if no data-roles attribute
    const allowed = rolesAttr.split(" ").includes(activeRole);
    item.classList.toggle("is-hidden", !allowed);
  });

  // Render admin dashboard when switching to admin role
  if (activeRole === "admin") {
    updateAdminStats();
    renderAdminUserTable();
    renderAdminPostTable();
    renderActivityLog();
  }

  renderAccessPanel();
  renderResearcherPosts();

  const activeItem = document.querySelector(".nav-item.active:not(.is-hidden)");
  if (!activeItem) {
    const firstAvailable = document.querySelector(".nav-item:not(.is-hidden)");
    setView(firstAvailable.dataset.view);
  }
}

function renderChart() {
  const metric = metricSelect.value;
  const aiData = trendData.filter((item) => item.fieldId === "ai");
  const max = Math.max(...aiData.map((item) => item[metric]));

  trendChart.style.setProperty("--bars", aiData.length);
  trendChart.innerHTML = aiData
    .map((item) => {
      const height = Math.max(8, Math.round((item[metric] / max) * 100));
      return `
        <div class="bar" title="${formatNumber(item[metric])}">
          <div class="bar-fill" style="height: ${height}%"></div>
          <span class="bar-label">${item.date}</span>
        </div>
      `;
    })
    .join("");
}

function renderFields() {
  fieldList.innerHTML = fields
    .map((field) => {
      return `
        <article class="field-row">
          <div class="field-row-header">
            <span>
              <strong>${field.fieldName}</strong><br />
              ${field.description}
            </span>
            <strong>${field.momentum}%</strong>
          </div>
          <div class="progress" aria-label="${field.fieldName} momentum">
            <span style="width: ${field.momentum}%"></span>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderFieldOptions() {
  fieldFilter.innerHTML += fields.map((field) => `<option value="${field.id}">${field.fieldName}</option>`).join("");
}

function renderPostOptions() {
  if (!postJournalSelect || !postFieldSelect) return;

  postJournalSelect.innerHTML = journals
    .map((journal) => `<option value="${journal.journalId}">${journal.title}</option>`)
    .join("");

  postFieldSelect.innerHTML = fields
    .map((field) => `<option value="${field.id}">${field.fieldName}</option>`)
    .join("");

  const selectedJournal = journals.find((journal) => journal.journalId === postJournalSelect.value);
  if (selectedJournal) postFieldSelect.value = selectedJournal.fieldId;
}

function renderAccessPanel() {
  if (!roleAccessPanel) return;

  if (activeRole === "admin") {
    accessTitle.textContent = "Administrator account";
    accessDescription.textContent = "You can approve researcher requests, manage users, and review article submissions.";
    requestResearcherButton.style.display = "none";
    return;
  }

  if (activeRole === "researcher") {
    accessTitle.textContent = "Researcher account";
    accessDescription.textContent = "Researcher access is approved. Saved searches and article submission are unlocked.";
    requestResearcherButton.style.display = "none";
    return;
  }

  const localUser = users.find((user) => user.email === currentUser?.email || user.userId === currentUser?.userId);
  const access = localUser?.researcherAccess || currentUser?.researcherAccess || "None";
  accessTitle.textContent = access === "Pending" ? "Researcher request pending" : "Reader account";
  accessDescription.textContent =
    access === "Pending"
      ? "Admin is reviewing your request. Posting features unlock after approval."
      : "You can read dashboards, inspect journal details, and search publication data. Request researcher access to submit articles.";
  requestResearcherButton.style.display = access === "Pending" ? "none" : "inline-flex";
}

function getFilteredJournals() {
  const query = journalSearch.value.trim().toLowerCase();
  const field = fieldFilter.value;

  return journals.filter((journal) => {
    const fieldName = getField(journal.fieldId).fieldName.toLowerCase();
    const matchesField = field === "all" || journal.fieldId === field;
    const matchesQuery =
      !query ||
      journal.title.toLowerCase().includes(query) ||
      fieldName.includes(query) ||
      journal.articles.some((article) => article.title.toLowerCase().includes(query));

    return matchesField && matchesQuery;
  });
}

function renderJournals() {
  const filtered = getFilteredJournals();

  if (filtered.length === 0) {
    selectedJournalId = null;
    journalList.innerHTML = `
      <div class="field-row">
        <strong>No journals found</strong>
        <div>Try another title, field, or article keyword.</div>
      </div>
    `;
    renderJournalDetail();
    return;
  }

  if (!filtered.some((journal) => journal.journalId === selectedJournalId)) {
    selectedJournalId = filtered[0].journalId;
  }

  journalList.innerHTML = filtered
    .map((journal) => {
      const field = getField(journal.fieldId);
      return `
        <button class="journal-card ${journal.journalId === selectedJournalId ? "active" : ""}" type="button" data-journal-id="${journal.journalId}">
          <span>
            <strong>${journal.title}</strong>
            ${journal.journalId} - ${field.fieldName}
          </span>
          <span class="impact-pill">IF ${journal.impactFactor}</span>
        </button>
      `;
    })
    .join("");

  renderJournalDetail();
}

function renderJournalDetail() {
  const journal = journals.find((item) => item.journalId === selectedJournalId);
  if (!journal) {
    detailTitle.textContent = "No journal selected";
    journalDetail.innerHTML = `
      <div class="detail-stat"><span>Result</span><strong>Empty</strong></div>
      <p>Search results will populate journalId, field, impactFactor, and related Article records here.</p>
    `;
    return;
  }

  const field = getField(journal.fieldId);
  detailTitle.textContent = journal.title;
  journalDetail.innerHTML = `
    <div class="detail-stat"><span>journalId</span><strong>${journal.journalId}</strong></div>
    <div class="detail-stat"><span>field</span><strong>${field.fieldName}</strong></div>
    <div class="detail-stat"><span>impactFactor</span><strong>${journal.impactFactor}</strong></div>
    <div class="article-list">
      ${journal.articles
        .map((article) => {
          return `
            <div class="paper-line">
              <span>
                <strong>${article.title}</strong><br />
                ${article.articleId} - ${article.publicationDate} - authorId ${article.authorId}
              </span>
              <strong>${formatNumber(article.citations)} citations</strong>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderTrendTable() {
  trendTable.innerHTML = trendData
    .map((item) => {
      return `
        <tr>
          <td>${item.date}</td>
          <td>${getField(item.fieldId).fieldName}</td>
          <td>${formatNumber(item.publicationCount)}</td>
          <td>${formatNumber(item.citationCount)}</td>
        </tr>
      `;
    })
    .join("");
}

function renderSavedSearches() {
  savedSearchList.innerHTML = savedSearches
    .map((search) => {
      return `
        <article class="saved-card">
          <span>
            <strong>${search.id}</strong>
            ${search.query}
          </span>
          <span class="impact-pill">${search.status}</span>
        </article>
      `;
    })
    .join("");
}

function renderEditorJournals() {
  editorJournalList.innerHTML = journals
    .map((journal, index) => {
      return `
        <article class="editor-card">
          <span>
            <strong>${journal.title}</strong>
            assignedJournals[${index}] - ${getField(journal.fieldId).fieldName}
          </span>
          <span class="impact-pill">${journal.articles.length} articles</span>
        </article>
      `;
    })
    .join("");
}

function renderUsers() {
  if (!legacyUserTable) return; // Skip if table doesn't exist
  legacyUserTable.innerHTML = users
    .map((user) => {
      return `
        <tr>
          <td>${user.userId}</td>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.role}</td>
          <td>${user.status}</td>
        </tr>
      `;
    })
    .join("");
}

// ============ ADMIN DASHBOARD FUNCTIONS ============
function updateAdminStats() {
  const totalUsers = users.length;
  const pendingResearchers = users.filter((u) => u.researcherAccess === "Pending").length;
  const researcherUsers = users.filter((u) => normalizeRole(u.role) === "researcher").length;
  const pendingPosts = submittedArticles.filter((article) => article.status === "Pending").length;

  totalUsersMetric.textContent = totalUsers;
  researcherCountMetric.textContent = pendingResearchers;
  editorCountMetric.textContent = researcherUsers;
  if (pendingPostsMetric) pendingPostsMetric.textContent = pendingPosts;
}

function renderAdminUserTable(searchTerm = "") {
  let filteredUsers = users;

  if (searchTerm.trim()) {
    filteredUsers = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  adminUserTable.innerHTML = filteredUsers
    .map((user) => {
      const statusClass = `status-${(user.status || "Active").toLowerCase()}`;
      const userId = user.id || user.userId;
      return `
        <tr>
          <td>${userId}</td>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.role || "User"}</td>
          <td><span class="status-badge ${getResearcherAccessClass(user.researcherAccess)}">${user.researcherAccess || "None"}</span></td>
          <td><span class="status-badge ${statusClass}">${user.status || "Active"}</span></td>
          <td>
            <div class="admin-user-actions">
              ${getResearcherActionButtons(user)}
              <button type="button" class="btn-edit" data-action="edit" data-user-id="${userId}">Edit</button>
              <button type="button" class="btn-toggle" data-action="toggle" data-user-id="${userId}">
                ${(user.status || "Active") === "Active" ? "Deactivate" : "Activate"}
              </button>
              <button type="button" class="btn-delete" data-action="delete" data-user-id="${userId}">Delete</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");

  // Add event listeners to action buttons
  adminUserTable.querySelectorAll("[data-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;
      const userId = btn.dataset.userId;
      handleUserAction(action, userId);
    });
  });
}

function getResearcherAccessClass(access = "None") {
  const normalized = access.toLowerCase().replace(/\s+/g, "-");
  return `status-${normalized}`;
}

function getResearcherActionButtons(user) {
  if ((user.researcherAccess || "None") !== "Pending") return "";
  const userId = user.id || user.userId;
  return `
    <button type="button" class="btn-approve" data-action="approve-researcher" data-user-id="${userId}">Approve</button>
    <button type="button" class="btn-reject" data-action="reject-researcher" data-user-id="${userId}">Reject</button>
  `;
}

function renderResearcherPosts() {
  if (!researcherPostList) return;

  const userId = getCurrentUserId();
  const visiblePosts = activeRole === "admin"
    ? submittedArticles
    : submittedArticles.filter((article) => article.researcherId === userId || (!currentUser && article.researcherId === "U-201"));

  if (!isResearcherRole()) {
    researcherPostList.innerHTML = `
      <article class="saved-card locked-card">
        <span>
          <strong>Posting locked</strong>
          Request researcher access and wait for admin approval to submit articles.
        </span>
      </article>
    `;
    return;
  }

  researcherPostList.innerHTML = visiblePosts.length
    ? visiblePosts
        .map((article) => {
          const journal = journals.find((item) => item.journalId === article.journalId);
          return `
            <article class="saved-card post-card">
              <span>
                <strong>${article.title}</strong>
                ${article.articleId} - ${journal?.title || "Unknown journal"}
              </span>
              <span class="status-badge ${getPostStatusClass(article.status)}">${article.status}</span>
            </article>
          `;
        })
        .join("")
    : `
      <article class="saved-card">
        <span>
          <strong>No submissions yet</strong>
          Submitted articles will appear here.
        </span>
      </article>
    `;
}

function renderAdminPostTable() {
  if (!adminPostTable) return;

  adminPostTable.innerHTML = submittedArticles
    .map((article) => {
      const journal = journals.find((item) => item.journalId === article.journalId);
      return `
        <tr>
          <td>${article.articleId}</td>
          <td>${article.title}</td>
          <td>${article.researcherName}</td>
          <td>${journal?.title || "Unknown journal"}</td>
          <td><span class="status-badge ${getPostStatusClass(article.status)}">${article.status}</span></td>
          <td>
            <div class="admin-user-actions">
              ${
                article.status === "Pending"
                  ? `
                    <button type="button" class="btn-approve" data-post-action="approve" data-article-id="${article.articleId}">Approve</button>
                    <button type="button" class="btn-reject" data-post-action="reject" data-article-id="${article.articleId}">Reject</button>
                  `
                  : `<button type="button" class="btn-edit" data-post-action="view" data-article-id="${article.articleId}">View</button>`
              }
            </div>
          </td>
        </tr>
      `;
    })
    .join("");

  adminPostTable.querySelectorAll("[data-post-action]").forEach((button) => {
    button.addEventListener("click", () => handlePostAction(button.dataset.postAction, button.dataset.articleId));
  });
}

function getPostStatusClass(status = "Pending") {
  return `status-${status.toLowerCase()}`;
}

function handlePostAction(action, articleId) {
  const article = submittedArticles.find((item) => item.articleId === articleId);
  if (!article) return;

  if (action === "view") {
    showDialog(article.title, article.abstract || "No abstract provided.", "info");
    return;
  }

  article.status = action === "approve" ? "Approved" : "Rejected";
  addActivityLog(`Article ${article.status.toLowerCase()}`, article.title);
  renderAdminPostTable();
  renderResearcherPosts();
  updateAdminStats();
  showNotification(`Article ${article.status.toLowerCase()}.`);
}

async function handleUserAction(action, userId) {
  const user = users.find((u) => u.id === userId || u.userId === userId);
  if (!user) return;

  const actualUserId = user.id || user.userId;

  if (action === "edit") {
    editingUserId = actualUserId;
    userModalTitle.textContent = "Edit User";
    userFormName.value = user.name;
    userFormEmail.value = user.email;
    userFormRole.value = user.role || "User";
    userFormStatus.value = user.status || "Active";
    userFormPassword.value = "";
    document.querySelector("#passwordHint").textContent = "Leave empty to keep existing password";
    userModal.classList.add("active");
  } else if (action === "approve-researcher") {
    user.role = "Researcher";
    user.researcherAccess = "Approved";
    addActivityLog("Researcher access approved", user.name);
    renderAdminUserTable(adminUserSearch.value);
    updateAdminStats();
    showNotification(`${user.name} is now a researcher.`);
  } else if (action === "reject-researcher") {
    user.role = "User";
    user.researcherAccess = "Rejected";
    addActivityLog("Researcher access rejected", user.name);
    renderAdminUserTable(adminUserSearch.value);
    updateAdminStats();
    showNotification(`Researcher request rejected for ${user.name}.`);
  } else if (action === "toggle") {
    try {
      const newStatus = user.status === "Active" ? "Inactive" : "Active";
      await apiCall(`/admin/users/${actualUserId}`, "PUT", {
        status: newStatus
      });
      user.status = newStatus;
      addActivityLog(`User ${newStatus === "Active" ? "activated" : "deactivated"}`, user.name);
      renderAdminUserTable(adminUserSearch.value);
      showNotification(`User ${newStatus === "Active" ? "activated" : "deactivated"}!`);
    } catch (error) {
      showNotification(error.message || "Failed to update user status!", "error");
    }
  } else if (action === "delete") {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      try {
        await apiCall(`/admin/users/${actualUserId}`, "DELETE");
        const index = users.findIndex((u) => u.id === actualUserId || u.userId === actualUserId);
        if (index > -1) {
          users.splice(index, 1);
        }
        addActivityLog("User deleted", user.name);
        renderAdminUserTable(adminUserSearch.value);
        showNotification(`User ${user.name} deleted successfully!`);
      } catch (error) {
        showNotification(error.message || "Failed to delete user!", "error");
      }
    }
  }
}

function openUserModal() {
  editingUserId = null;
  userModalTitle.textContent = "Add New User";
  userFormElement.reset();
  userFormPassword.value = "";
  document.querySelector("#passwordHint").textContent = "Required for new users";
  userModal.classList.add("active");
}

function closeUserModalFunction() {
  userModal.classList.remove("active");
  editingUserId = null;
  userFormElement.reset();
}

async function saveUser(event) {
  event.preventDefault();
  const name = userFormName.value.trim();
  const email = userFormEmail.value.trim();
  const role = userFormRole.value;
  const status = userFormStatus.value;
  const password = userFormPassword.value;

  if (!name || !email) {
    showNotification("Name and email are required!", "error");
    return;
  }

  try {
    if (editingUserId) {
      // Edit existing user
      const updateData = { name, email, role, status };
      if (password) updateData.password = password;
      
      await apiCall(`/admin/users/${editingUserId}`, "PUT", updateData);
      
      const user = users.find((u) => u.id === editingUserId || u.userId === editingUserId);
      if (user) {
        user.name = name;
        user.email = email;
        user.role = role;
        user.status = status;
        user.researcherAccess = role === "Researcher" || role === "Admin" ? "Approved" : user.researcherAccess || "None";
      }
      addActivityLog("User updated", name);
      showNotification("User updated successfully!");
    } else {
      // Add new user
      if (!password) {
        showNotification("Password is required for new users!", "error");
        return;
      }

      const response = await apiCall("/admin/users", "POST", {
        name,
        email,
        username: email.split("@")[0],  // Generate username from email
        password,
        role,
        status,
        researcherAccess: role === "Researcher" || role === "Admin" ? "Approved" : "None"
      });

      if (response.user) {
        users.push({
          ...response.user,
          researcherAccess: response.user.researcherAccess || (role === "Researcher" || role === "Admin" ? "Approved" : "None")
        });
        addActivityLog("New user created", name);
        showNotification("User created successfully!");
      }
    }

    closeUserModalFunction();
    renderAdminUserTable();
    updateAdminStats();
  } catch (error) {
    showNotification(error.message || "Failed to save user!", "error");
  }
}

function addActivityLog(event, user) {
  const log = {
    id: activityLogs.length + 1,
    event: event,
    user: user,
    timestamp: new Date()
  };
  activityLogs.unshift(log);
  if (activityLogs.length > 20) activityLogs.pop();
  renderActivityLog();
}

function renderActivityLog() {
  activityLog.innerHTML = activityLogs
    .slice(0, 10)
    .map((log) => {
      const time = log.timestamp.toLocaleTimeString();
      const date = log.timestamp.toLocaleDateString();
      return `
        <div class="activity-item">
          <div class="activity-icon">📋</div>
          <div class="activity-content">
            <strong>${log.event}</strong>
            <small>${log.user}</small>
          </div>
          <div class="activity-time">${date} ${time}</div>
        </div>
      `;
    })
    .join("");
}

// ============ AUTHENTICATION FUNCTIONS ============
function showAuthForm(formType) {
  loginForm.classList.remove("active");
  registerForm.classList.remove("active");
  forgotPasswordForm.classList.remove("active");

  if (formType === "login") {
    loginForm.classList.add("active");
  } else if (formType === "register") {
    registerForm.classList.add("active");
  } else if (formType === "forgotPassword") {
    forgotPasswordForm.classList.add("active");
  }
}

function showAppShell() {
  authContainer.style.display = "none";
  appShell.style.display = "grid";
}

function showAuthContainer() {
  authContainer.style.display = "flex";
  appShell.style.display = "none";
}

async function loginUser(loginInput, password) {
  try {
    const response = await apiCall("/auth/login", "POST", {
      loginInput: loginInput,
      password: password
    });

    if (response.token) {
      // Store token
      authToken = response.token;
      localStorage.setItem("authToken", authToken);

      // Store user data
      const user = response.user;
      currentUser = user;
      activeRole = normalizeRole(user.role);

      // Render UI
      showAppShell();
      renderFieldOptions();
      renderChart();
      renderFields();
      renderJournals();
      renderTrendTable();
      renderSavedSearches();
      renderEditorJournals();
      renderPostOptions();
      renderResearcherPosts();

      // Load users for admin
      if (activeRole === "admin") {
        await loadUsers();
        updateAdminStats();
        renderAdminUserTable();
        renderAdminPostTable();
        renderActivityLog();
        addActivityLog("Admin login", user.name);
        setView("admin");
        showDialog(
          "Welcome Admin",
          `Welcome back, ${user.name}! You are now logged in to the Admin Dashboard.`,
          "success"
        );
      } else {
        showDialog(
          "Login Successful",
          `Welcome, ${user.name.split(" ")[0]}! You have successfully logged in.`,
          "success"
        );
      }

      applyRole(activeRole);
      activeRoleLabel.textContent = user.role || "User";
      document.querySelector(".user-chip strong").textContent = user.name.split(" ")[0];
      showNotification("Login successful!");
      return true;
    }
  } catch (error) {
    showNotification(error.message || "Invalid email/username or password!", "error");
    return false;
  }
  return false;
}

async function registerUser(name, email, username, password, confirmPassword) {
  // Client-side validation
  if (password !== confirmPassword) {
    showNotification("Passwords do not match!", "error");
    return false;
  }

  if (password.length < 8) {
    showNotification("Password must be at least 8 characters!", "error");
    return false;
  }

  try {
    const response = await apiCall("/auth/register", "POST", {
      name: name,
      email: email,
      username: username,
      password: password
    });

    if (response.user) {
      registeredUsers.push({ ...response.user, role: response.user.role || "User", researcherAccess: "None" });
      showDialog(
        "Account Created",
        `Welcome, ${name}! Your account has been created successfully. Please log in with your credentials.`,
        "success"
      );
      showNotification("Account created successfully! Please login.");
      showAuthForm("login");
      return true;
    }
  } catch (error) {
    showNotification(error.message || "Registration failed!", "error");
    return false;
  }
}

async function loadUsers() {
  try {
    const response = await apiCall("/admin/users", "GET");
    users = (response.users || response.data || []).map((user) => ({
      ...user,
      researcherAccess:
        user.researcherAccess ||
        (normalizeRole(user.role) === "researcher" || normalizeRole(user.role) === "admin" ? "Approved" : "None")
    }));
    renderAdminUserTable();
  } catch (error) {
    console.error("Failed to load users:", error);
  }
}

async function resetPassword(email) {
  try {
    // In a real app, this would call a backend API to send password reset email
    // For now, we'll simulate the backend response
    if (!email || !email.includes("@")) {
      showNotification("Please enter a valid email address!", "error");
      return false;
    }

    // Simulate API call delay
    showNotification("Sending password reset link...");
    
    // In production, uncomment and use this:
    // const response = await apiCall("/auth/forgot-password", "POST", { email });
    // if (response) { ... }

    showDialog(
      "Reset Link Sent",
      `A password reset link has been sent to ${email}. Please check your email and follow the instructions to reset your password.`,
      "success"
    );
    showAuthForm("login");
    return true;
  } catch (error) {
    showNotification(error.message || "Failed to send reset link!", "error");
    return false;
  }
}

function logoutUser() {
  currentUser = null;
  activeRole = "user";
  loginFormElement.reset();
  registerFormElement.reset();
  forgotPasswordFormElement.reset();
  showAuthContainer();
  showAuthForm("login");
}

function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("show");
  }, 100);

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function showDialog(title, message, type = "info") {
  // Create dialog overlay
  const overlay = document.createElement("div");
  overlay.className = "dialog-overlay";
  
  // Create dialog container
  const dialog = document.createElement("div");
  dialog.className = `dialog dialog-${type}`;
  
  // Add dialog content
  dialog.innerHTML = `
    <div class="dialog-header">
      <h2>${title}</h2>
      <button class="dialog-close" aria-label="Close dialog">&times;</button>
    </div>
    <div class="dialog-content">
      <p>${message}</p>
    </div>
    <div class="dialog-actions">
      <button class="btn-primary dialog-ok">OK</button>
    </div>
  `;
  
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);
  
  // Handle close button
  const closeBtn = dialog.querySelector(".dialog-close");
  const okBtn = dialog.querySelector(".dialog-ok");
  
  const closeDialog = () => {
    overlay.classList.add("fade-out");
    setTimeout(() => overlay.remove(), 300);
  };
  
  closeBtn.addEventListener("click", closeDialog);
  okBtn.addEventListener("click", closeDialog);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeDialog();
  });
  
  // Show dialog with animation
  setTimeout(() => overlay.classList.add("show"), 10);
}

navItems.forEach((item) => {
  item.addEventListener("click", () => setView(item.dataset.view));
});

// ============ AUTHENTICATION EVENT LISTENERS ============
loginFormElement.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = loginEmailInput.value.trim();
  const password = loginPasswordInput.value;

  const loggedIn = await loginUser(email, password);
  if (loggedIn) {
    loginFormElement.reset();
  }
});

registerFormElement.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = registerNameInput.value.trim();
  const username = registerUsernameInput.value.trim();
  const email = registerEmailInput.value.trim();
  const password = registerPasswordInput.value;
  const confirmPassword = registerConfirmPasswordInput.value;

  const registered = await registerUser(name, email, username, password, confirmPassword);
  if (registered) {
    registerFormElement.reset();
  }
});

forgotPasswordFormElement.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = resetEmailInput.value.trim();
  
  if (!email) {
    showNotification("Please enter your email address!", "error");
    return;
  }
  
  resetPassword(email);
  setTimeout(() => {
    forgotPasswordFormElement.reset();
  }, 1000);
});

registerLink.addEventListener("click", () => showAuthForm("register"));
forgotPasswordLink.addEventListener("click", () => showAuthForm("forgotPassword"));
backToLoginLink.addEventListener("click", () => showAuthForm("login"));
backToLoginLink2.addEventListener("click", () => showAuthForm("login"));

// Logout button
const logoutBtn = document.querySelector("#logoutBtn");
logoutBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to logout?")) {
    logoutUser();
  }
});

// ============ APP EVENT LISTENERS ============

jumpButtons.forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.viewJump));
});

metricSelect.addEventListener("change", renderChart);
journalSearch.addEventListener("input", renderJournals);
fieldFilter.addEventListener("change", renderJournals);
postJournalSelect.addEventListener("change", () => {
  const selectedJournal = journals.find((journal) => journal.journalId === postJournalSelect.value);
  if (selectedJournal) postFieldSelect.value = selectedJournal.fieldId;
});

journalList.addEventListener("click", (event) => {
  const card = event.target.closest("[data-journal-id]");
  if (!card) return;
  selectedJournalId = card.dataset.journalId;
  renderJournals();
});

saveSearchButton.addEventListener("click", () => {
  if (!isResearcherRole()) {
    showDialog(
      "Researcher Access Required",
      "Saved searches are available after admin approves your researcher access request.",
      "warning"
    );
    return;
  }

  const query = journalSearch.value.trim() || "all journals";
  savedSearches = [
    { id: `S-${String(savedSearches.length + 1).padStart(2, "0")}`, query, owner: "U-201", status: "Active" },
    ...savedSearches
  ];
  renderSavedSearches();
  setView("saved");
});

clearSavedButton.addEventListener("click", () => {
  savedSearches = savedSearches.filter((search) => search.status !== "Completed");
  renderSavedSearches();
});

reportButton.addEventListener("click", () => {
  const top = trendData
    .filter((item) => item.date === "2026")
    .sort((a, b) => b.publicationCount - a.publicationCount)[0];
  const field = getField(top.fieldId);
  reportTitle.textContent = `${field.fieldName} Growth Summary`;
  reportTopField.textContent = field.fieldName;
  reportBody.textContent = `${field.fieldName} leads 2026 tracked output with ${formatNumber(top.publicationCount)} publications and ${formatNumber(top.citationCount)} citations. The report combines Analyze Trends with Analyze Field Data from the UML workflow.`;
});

assignJournalButton.addEventListener("click", () => {
  setView("search");
});

requestResearcherButton.addEventListener("click", () => {
  const userId = getCurrentUserId();
  let localUser = users.find((user) => user.email === currentUser?.email || user.userId === userId);

  if (!localUser) {
    localUser = {
      userId,
      name: getCurrentUserName(),
      email: currentUser?.email || "current.user@scipub.test",
      role: "User",
      status: "Active",
      researcherAccess: "Pending"
    };
    users.push(localUser);
  } else {
    localUser.researcherAccess = "Pending";
  }

  if (currentUser) currentUser.researcherAccess = "Pending";
  renderAccessPanel();
  updateAdminStats();
  renderAdminUserTable(adminUserSearch.value);
  addActivityLog("Researcher access requested", localUser.name);
  showNotification("Researcher access request sent to admin.");
});

postFormElement.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!isResearcherRole()) {
    showDialog(
      "Posting Locked",
      "Only approved researchers can submit articles. Please request researcher access first.",
      "warning"
    );
    return;
  }

  const selectedJournal = journals.find((journal) => journal.journalId === postJournalSelect.value);
  const article = {
    articleId: `SUB-${String(submittedArticles.length + 1).padStart(3, "0")}`,
    title: postTitleInput.value.trim(),
    journalId: postJournalSelect.value,
    fieldId: postFieldSelect.value,
    researcherId: getCurrentUserId(),
    researcherName: getCurrentUserName(),
    abstract: postAbstractInput.value.trim(),
    status: "Pending"
  };

  submittedArticles.unshift(article);
  postFormElement.reset();
  if (selectedJournal) postFieldSelect.value = selectedJournal.fieldId;
  renderResearcherPosts();
  renderAdminPostTable();
  updateAdminStats();
  addActivityLog("Article submitted for review", article.title);
  showNotification("Article submitted for admin review.");
});

// ============ ADMIN DASHBOARD EVENT LISTENERS ============
addUserButton.addEventListener("click", () => {
  if (activeRole === "admin") {
    openUserModal();
  }
});

closeUserModal.addEventListener("click", () => {
  closeUserModalFunction();
});

cancelUserForm.addEventListener("click", () => {
  closeUserModalFunction();
});

userFormElement.addEventListener("submit", saveUser);

adminUserSearch.addEventListener("input", (e) => {
  renderAdminUserTable(e.target.value);
});

refreshStatsButton.addEventListener("click", () => {
  updateAdminStats();
  renderAdminUserTable(adminUserSearch.value);
  showNotification("Stats refreshed!");
});

// Close modal when clicking outside
userModal.addEventListener("click", (e) => {
  if (e.target === userModal) {
    closeUserModalFunction();
  }
});

renderFieldOptions();
renderChart();
renderFields();
renderJournals();
renderTrendTable();
renderSavedSearches();
renderEditorJournals();
renderPostOptions();
renderResearcherPosts();
renderAdminPostTable();
renderUsers();
applyRole(activeRole);

// Theme + language
if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    const next = getTheme() === "dark" ? "light" : "dark";
    setTheme(next);
  });
}

if (languageSelect) {
  languageSelect.addEventListener("change", () => {
    localStorage.setItem("lang", languageSelect.value);
    applyI18n();
    // keep role text as-is
    setTheme(getTheme());
  });
}

initI18nAndTheme();

// Initialize: Show auth container, hide app shell
showAuthContainer();
showAuthForm("login");
