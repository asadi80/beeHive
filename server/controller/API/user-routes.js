require("dotenv").config();
const router = require("express").Router();
const {
  User,
  Organization,
  Link,
  Menu,
  Meal,
  Category,
} = require("../../models");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;

// Middleware for input validation
const validateInput = (req, res, next) => {
  const { email, name, phone, location } = req.body;
  if (!email) return res.status(401).json({ message: "Email is required" });
  if (!name) return res.status(401).json({ message: "Name is required" });
  if (!phone) return res.status(401).json({ message: "Phone is required" });
  if (!location) return res.status(401).json({ message: "location is required" });

  next();
};

// Middleware for id validation
const validateId = (req, res, next) => {
  const userId = req.body.userId;
  const organizationId = req.params.id;
  if (!mongoose.isValidObjectId(organizationId))
    return res.status(404).json({ message: "Invalid organization ID" });
  if (!mongoose.isValidObjectId(userId))
    return res.status(404).json({ message: "Invalid user ID" });
  next();
};

// Sign Up
const signup = async (req, res) => {
  const { email, name, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(409).json({ message: "Email already exists" });

  const user = new User({ name, email, password });
  const userData = await user.save();
  if (!userData)
    return res.status(400).json({ message: "User cannot be created" });

  const token = jwt.sign({ userId: userData.id }, secret, { expiresIn: "1h" });
  return res.status(201).json({ user: userData.email, token });
};

// Log In
const logIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(404).json({ message: "No user found with this email" });

  const correctPw = await user.isCorrectPassword(password);
  if (!correctPw)
    return res.status(401).json({ message: "Incorrect credentials" });

  const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "1h" });
  return res.status(200).json({ user: user.email, token });
};

// Create Organization
const createOrganization = async (req, res) => {
  const { email, name, phone, location } = req.body;

  const existingOrg = await Organization.findOne({ email });
  if (existingOrg)
    return res.status(409).json({ message: "Email already exists" });

  const organization = new Organization({
    name,
    email,
    phone,
    location,
    ...req.body,
  });
  const organizationData = await organization.save();
  if (!organizationData)
    return res.status(400).json({ message: "Organization cannot be created" });
  const shopId = organizationData.id;
  const userId = req.params.id;

  // checking if the id is valid or not
  if (!mongoose.isValidObjectId(userId))
    return res.status(404).json({ message: "Invalid user id" });

  // checking if the id is valid or not
  if (!mongoose.isValidObjectId(shopId))
    return res.status(404).json({ message: "Invalid shop id" });

  const findUser = await User.findById(userId);
  if (!findUser)
    return res.status(404).json({ message: "user not found with this id" });

  const addShop = await User.findByIdAndUpdate(
    userId,
    { $push: { shops: shopId } },
    { new: true }
  );

  if (!addShop)
    return res.status(404).json({ message: "No shop found with this id" });

  return res.status(201).json({ organization: organizationData });
};

// Get shope info
const getShopInfo = async (req, res) => {
  const organizationId = req.params.id;
  if (!mongoose.isValidObjectId(organizationId))
    return res.status(404).json({ message: "Invalid organization ID" });

  const organization = await Organization.findById(organizationId)
    .select("-__v")
    .populate({ path: "menu", populate: { path: "meal" } });

  if (!organization)
    return res
      .status(401)
      .json({ message: "No organization found with this ID" });
  return res.status(200).json(organization);
};

// Add Link
const addLink = async (req, res) => {
  const { facebook, x, instagram } = req.body;
  // const link = new Link({facebook, x, instagram, ...req.body});
  // const linkData = await link.save();
  const organizationId = req.params.id;

  // if (!linkData) return res.status(400).json({ message: "Link cannot be created" });
  if (!mongoose.isValidObjectId(organizationId))
    return res.status(404).json({ message: "Invalid organization ID" });

  const updatedOrganization = await Organization.findByIdAndUpdate(
    organizationId,
    { facebook: facebook, x: x, instagram: instagram },
    { new: true }
  );

  if (!updatedOrganization)
    return res.status(404).json({ message: "Organization not found" });
  return res.status(200).json(updatedOrganization);
};

// Add Menu
const addMenu = async (req, res) => {
  const menu = new Menu({ category: req.body.category });
  const menuData = await menu.save();

  if (!menuData)
    return res.status(400).json({ message: "Menu cannot be created" });

  const organizationId = req.params.id;
  if (!mongoose.isValidObjectId(organizationId))
    return res.status(404).json({ message: "Invalid organization ID" });

  const updatedOrganization = await Organization.findByIdAndUpdate(
    organizationId,
    { $push: { menu: menuData.id } },
    { new: true }
  ).populate({ path: "menu", populate: { path: "meal" } });

  if (!updatedOrganization)
    return res.status(404).json({ message: "Organization not found" });
  return res.status(200).json(updatedOrganization);
};

// Add Meal
const addMeal = async (req, res) => {
  const {  name, price, ingredients, imageUrl } = req.body;

  const meal = new Meal({
    name,
    price,
    ingredients,
    imageUrl,
    ...req.body,
  });
  const mealData = await meal.save();

  if (!mealData)
    return res.status(400).json({ message: "Meal cannot be created" });

  const menuId = req.params.id;
  if (!mongoose.isValidObjectId(menuId))
    return res.status(404).json({ message: "Invalid menu ID" });

  const updatedMenu = await Menu.findByIdAndUpdate(
    menuId,
    { $push: { meal: mealData.id } },
    { new: true }
  ).populate({ path: "meal" });

  if (!updatedMenu) return res.status(404).json({ message: "Menu not found" });
  return res.status(200).json(updatedMenu);
};

// Add Category
const addCategory = async (req, res) => {
  const category = new Category(req.body);
  const categoryData = await category.save();

  if (!categoryData)
    return res.status(400).json({ message: "Category cannot be created" });
  return res.status(201).json(categoryData);
};

// Get All Categories
const getCategories = async (req, res) => {
  const categories = await Category.find()
    .select("-__v")
    .populate({ path: "store" });

  if (!categories)
    return res.status(404).json({ message: "No categories found" });
  return res.status(200).json(categories);
};

const userShops = async (req, res) => {
  const userId = req.params.id;
  const shopsInfo = await User.findById(userId)
    .select("-__v, -password, -email, -name")
    .populate({ path: "shops" });

  if (!shopsInfo) return res.status(404).json({ message: "No user found" });
  return res.status(200).json(shopsInfo);
};

const getShopsInMyArea = async (req, res) => {
  const shopsInfo = await Organization.find().select("-__v");
  if (!shopsInfo) return res.status(404).json({ message: "No shops found" });
  return res.status(200).json(shopsInfo);
};

const updateSocialMedia = async (req, res) => {
  const facebook = req.body.facebook;
  const organizationId = req.params.id;

  if (!mongoose.isValidObjectId(organizationId))
    return res.status(404).json({ message: "Invalid organization ID" });

  const updatedOrganization = await Organization.findByIdAndUpdate(
    organizationId,
    { $push: { socialMedia: { facebook: facebook } } },
    { new: true }
  );

  if (!updatedOrganization)
    return res.status(404).json({ message: "Organization not found" });
  return res.status(200).json(updatedOrganization);
};

const deleteShop = async (req, res) => {
  const userId = req.body.userId;
  const organizationId = req.params.id;

  const deleteOrganization = await Organization.findByIdAndDelete(
    organizationId
  );

  if (!deleteOrganization)
    return res.status(404).json({ message: "Organization was not deleted" });

  const deleteShopFromUser = await User.findByIdAndUpdate(
    userId,
    { $pull: { shops: organizationId } },
    { new: true }
  );

  if (!deleteShopFromUser)
    return res.status(404).json({ message: "Shop was not deleted" });

  return res.status(200).json(deleteOrganization);
};

const updateAboutUs = async (req, res) => {
  const organizationId = req.params.id;
  const { about } = req.body;

  if (!mongoose.isValidObjectId(organizationId))
    return res.status(404).json({ message: "Invalid organization ID" });

  const updatedOrganization = await Organization.findByIdAndUpdate(
    organizationId,
    { about: about },
    { new: true }
  );

  if (!updatedOrganization)
    return res.status(404).json({ message: "About was not updated " });
  return res.status(200).json(updatedOrganization);
};



// Get shope info
const getShopInfoPublic = async (req, res) => {
  const organizationI = req.query.shopId;
  
  if (!mongoose.isValidObjectId(organizationI))
    return res.status(401).json({ message: "Invalid organization ID" });

  const organization = await Organization.findById(organizationI)
    .select("-__v")
    .populate({ path: "menu", populate: { path: "meal" } });

  if (!organization)
    return res
      .status(404)
      .json({ message: "No organization found with this ID" });
  return res.status(200).json(organization);
};

const UpdateShopLogo = async (req, res) => {
  const organizationId = req.params.id;
  const { logo } = req.body;

  if (!mongoose.isValidObjectId(organizationId))
    return res.status(404).json({ message: "Invalid organization ID" });

  const updatedOrganization = await Organization.findByIdAndUpdate(
    organizationId,
    { logo: logo },
    { new: true }
  );

  if (!updatedOrganization)
    return res.status(404).json({ message: "Logo was not updated " });
  return res.status(200).json(updatedOrganization);
};

const UpdateShopColor = async (req, res) => {
  const organizationId = req.params.id;
  const { color } = req.body;

  if (!mongoose.isValidObjectId(organizationId))
    return res.status(404).json({ message: "Invalid organization ID" });

  const updatedOrganization = await Organization.findByIdAndUpdate(
    organizationId,
    { color: color },
    { new: true }
  );

  if (!updatedOrganization)
    return res.status(404).json({ message: "Logo was not updated " });
  return res.status(200).json(updatedOrganization);
};

const deleteMeal = async (req, res) => {
  const menuId = req.body.menuId;
  const mealId = req.params.id;
  // if (!linkData) return res.status(400).json({ message: "Link cannot be created" });
  if (!mongoose.isValidObjectId(menuId))
    return res.status(404).json({ message: "Invalid menu ID" });
  // if (!linkData) return res.status(400).json({ message: "Link cannot be created" });
  if (!mongoose.isValidObjectId(mealId))
    return res.status(404).json({ message: "Invalid meal ID" });

  const deleteMeal = await Meal.findByIdAndDelete(
    mealId
  );

  if (!deleteMeal)
    return res.status(404).json({ message: "Meal was not deleted" });

  const delteMealFromMenu = await Menu.findByIdAndUpdate(
    menuId,
    { $pull: { meal: mealId } },
    { new: true }
  );

  if (!delteMealFromMenu)
    return res.status(404).json({ message: "Meal was not deleted" });

  return res.status(200).json(delteMealFromMenu);
};
// Routes
router.post("/signup", signup);
router.post("/login", logIn);
router.post("/create-organization/:id", validateInput, createOrganization);
router.get("/shop-info/:id", getShopInfo);
router.put("/add-link/:id", addLink);
router.post("/add-menu/:id", addMenu);
router.post("/add-meal/:id", addMeal);
router.post("/add-category", addCategory);
router.get("/all-categories", getCategories);
router.get("/user-shops/:id", userShops);
router.get("/shops", getShopsInMyArea);
router.put("/update-social-media/:id", updateSocialMedia);
router.delete("/delete-shope/:id", validateId, deleteShop);
router.put("/update-about-us/:id", updateAboutUs);
router.get("/shopinfopublic", getShopInfoPublic);
router.put("/update-shop-logo/:id", UpdateShopLogo);
router.put("/update-shop-color/:id", UpdateShopColor);
router.delete("/delete-meal/:id",  deleteMeal);





module.exports = router;
