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
let users = [];  // Will be populated from backend

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

const users = [
  { userId: "U-201", name: "Dr. Minh Nguyen", email: "minh.nguyen@scipub.test", role: "User", status: "Active" },
  { userId: "U-301", name: "Linh Tran", email: "linh.tran@scipub.test", role: "User", status: "Active" },
  { userId: "U-401", name: "Bao Pham", email: "bao.pham@scipub.test", role: "User", status: "Active" }
];

let savedSearches = [
  { id: "S-01", query: "field:Artificial Intelligence impactFactor > 8", owner: "U-201", status: "Active" },
  { id: "S-02", query: "citations > 900 publicationDate:2026", owner: "U-201", status: "Active" },
  { id: "S-03", query: "field:Energy Systems trend:growing", owner: "U-201", status: "Completed" }
];

let selectedJournalId = journals[0].journalId;
let activeRole = "user";

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

function setView(viewName) {
  const target = document.querySelector(`#${viewName}View`);
  if (!target) return;

  views.forEach((view) => view.classList.toggle("active", view === target));
  navItems.forEach((item) => item.classList.toggle("active", item.dataset.view === viewName));
  pageTitle.textContent = target.dataset.title;
}

function applyRole(role) {
  activeRole = role;
  activeRoleLabel.textContent = role.charAt(0).toUpperCase() + role.slice(1);

  navItems.forEach((item) => {
    const rolesAttr = item.dataset.roles;
    if (!rolesAttr) return; // Skip if no data-roles attribute
    const allowed = rolesAttr.split(" ").includes(role);
    item.classList.toggle("is-hidden", !allowed);
  });

  // Render admin dashboard when switching to admin role
  if (role === "admin") {
    updateAdminStats();
    renderAdminUserTable();
    renderActivityLog();
  }

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
  const activeUsers = users.filter((u) => u.status === "Active").length;
  const adminUsers = users.filter((u) => u.role === "Admin").length;

  totalUsersMetric.textContent = totalUsers;
  researcherCountMetric.textContent = activeUsers;
  editorCountMetric.textContent = adminUsers;
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
          <td><span class="status-badge ${statusClass}">${user.status || "Active"}</span></td>
          <td>
            <div class="admin-user-actions">
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
        status
      });

      if (response.user) {
        users.push(response.user);
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
      activeRole = user.role.toLowerCase();

      // Render UI
      showAppShell();
      renderFieldOptions();
      renderChart();
      renderFields();
      renderJournals();
      renderTrendTable();
      renderSavedSearches();
      renderEditorJournals();

      // Load users for admin
      if (activeRole === "admin") {
        await loadUsers();
        updateAdminStats();
        renderAdminUserTable();
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
      activeRoleLabel.textContent = user.role === "Admin" ? "Admin" : "User";
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
    users = response.users || response.data || [];
    renderAdminUserTable();
  } catch (error) {
    console.error("Failed to load users:", error);
  }
}

function resetPassword(email) {
  const user = registeredUsers.find((u) => u.email === email);
  if (user) {
    // In a real app, send email with reset link
    showNotification("Password reset link sent to " + email);
    showAuthForm("login");
    return true;
  } else {
    showNotification("Email not found!", "error");
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
loginFormElement.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = loginEmailInput.value.trim();
  const password = loginPasswordInput.value;

  if (loginUser(email, password)) {
    loginFormElement.reset();
  } else {
    showNotification("Invalid email or password!", "error");
  }
});

registerFormElement.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = registerNameInput.value.trim();
  const username = registerUsernameInput.value.trim();
  const email = registerEmailInput.value.trim();
  const password = registerPasswordInput.value;
  const confirmPassword = registerConfirmPasswordInput.value;

  if (registerUser(name, email, username, password, confirmPassword)) {
    registerFormElement.reset();
  }
});

forgotPasswordFormElement.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = resetEmailInput.value.trim();
  resetPassword(email);
  forgotPasswordFormElement.reset();
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

journalList.addEventListener("click", (event) => {
  const card = event.target.closest("[data-journal-id]");
  if (!card) return;
  selectedJournalId = card.dataset.journalId;
  renderJournals();
});

saveSearchButton.addEventListener("click", () => {
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
renderUsers();
applyRole(activeRole);

// Initialize: Show auth container, hide app shell
showAuthContainer();
showAuthForm("login");
