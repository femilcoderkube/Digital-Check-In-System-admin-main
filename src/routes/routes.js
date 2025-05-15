export const routes = [
  { path: "/login", component: "auth/login/Login", isPublic: true },
  { path: "/", component: "dashboard/Home" },

  { path: "/card-list", component: "card/CardList" },
 
  { path: "/add-card", component: "card/AddCard" },
  { path: "/view-card/:id", component: "card/ViewCard" },
  { path: "/edit-card/:id", component: "card/EditCard" },
 
   { path: "/add-category", component: "category/AddCategory" },
    { path: "/edit-category/:id", component: "category/EditCategory" },
  { path: "/view-category/:id", component: "category/ViewCategory" },
   { path: "/category-list", component: "category/CategoryList" },
];
