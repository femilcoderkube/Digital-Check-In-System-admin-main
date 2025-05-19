export const routes = [
  { path: "/login", component: "auth/login/Login", isPublic: true },
  { path: "/", component: "dashboard/Home" },

  // { path: "/card-list", component: "card/CardList" },

  // { path: "/add-card", component: "card/AddCard" },
  // { path: "/view-card/:id", component: "card/ViewCard" },
  // { path: "/edit-card/:id", component: "card/EditCard" },

  { path: "/add-kids", component: "kids/AddKids" },
  { path: "/edit-kids/:id", component: "kids/EditKids" },
  { path: "/view-kids/:id", component: "kids/ViewKids" },
  { path: "/kids-list", component: "kids/KidsList" },

  { path: "/add-kids-feeling", component: "kidsFeeling/AddKidsFeeling" },
  { path: "/edit-kids-feeling/:id", component: "kidsFeeling/EditKidsFeeling" },
  { path: "/view-kids-feeling/:id", component: "kidsFeeling/ViewKidsFeeling" },
  { path: "/kids-feeling-list", component: "kidsFeeling/KidsFeelingList" },

  { path: "/add-category", component: "category/AddCategory" },
  { path: "/edit-category/:id", component: "category/EditCategory" },
  { path: "/view-category/:id", component: "category/ViewCategory" },
  { path: "/category-list", component: "category/CategoryList" },

  { path: "/guidance-list", component: "Guidance/GuidanceList" },
  { path: "/add-guidance", component: "Guidance/AddGuidance" },
  { path: "/edit-guidance/:id", component: "Guidance/EditGuidance" },
  { path: "/view-guidance/:id", component: "Guidance/ViewGuidance" },

  { path: "/feeling-list", component: "feeling/FeelingList" },
  { path: "/add-feeling", component: "feeling/AddFeeling" },
  { path: "/edit-feeling/:id", component: "feeling/EditFeeling" },
  { path: "/view-feeling/:id", component: "feeling/ViewFeeling" },
];
