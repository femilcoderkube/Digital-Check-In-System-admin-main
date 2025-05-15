import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Please enter your email"),
  password: yup.string().required("Please enter your password"),
});

export const sendEmailSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Please enter your email"),
});

export const otpCodeSchema = yup.object().shape({
  otp: yup
    .string()
    .required("OTP is required")
    .matches(/^\d{6}$/, "OTP must be exactly 6 digits and number"),
});

export const changePasswordSchema = yup.object({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("New password is required"),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "New password must match")
    .required("Re-enter new password is required"),
});

export const forgotPasswordSchema = yup.object({
  newPassword: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("New password is required"),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Confirm password must match")
    .required("Confirm  password is required"),
});

export const categorySchema = yup.object().shape({
  name: yup
    .string()
    .matches(
      /^[a-zA-Z'&][a-zA-Z\s()&'-]*[a-zA-Z'&)]$/,

      "Category name must contain only letters, spaces, hyphens, and parentheses, and cannot start or end with a space, hyphen, or opening parenthesis"
    )
    .matches(
      /^(?!.*\s{2}).*$/,
      "Category name cannot contain consecutive spaces"
    )
    .matches(
      /^(?!.*-{2}).*$/,
      "Category name cannot contain consecutive hyphens"
    )
    .matches(/^(?!.*\(\)).*$/, "Category name cannot contain empty parentheses")
    .max(60, "Category name must be at most 60 characters long")
    .required("Please enter Category name"),
  image: yup
    .mixed()
    .required("Category image is required")
    .test("fileType", "Only image file is allowed", function (value) {
      if (typeof value === "string") {
        const urlPattern = /^(http|https):\/\/[^ "]+$/;
        const extensionPattern = /\.(jpg|jpeg|png|gif|webp|heic|heif)$/;
        return urlPattern.test(value) && extensionPattern.test(value);
      } else if (value && value.type) {
        return value.type.startsWith("image/");
      }
      return false;
    })
    .test("fileSize", "Image size must be under 5MB", function (value) {
      if (value && value.size) {
        return value.size <= 5 * 1024 * 1024;
      }
      return true;
    }),
});

export const bankSchema = yup.object().shape({
  image: yup
    .mixed()
    .required("Bank image is required")
    .test("fileType", "Only image file is allowed", function (value) {
      if (typeof value === "string") {
        const urlPattern = /^(http|https):\/\/[^ "]+$/;
        const extensionPattern = /\.(jpg|jpeg|png|gif|webp|heic|heif)$/;
        return urlPattern.test(value) && extensionPattern.test(value);
      } else if (value && value.type) {
        return value.type.startsWith("image/");
      }
      return false;
    })
    .test("fileSize", "Image size must be under 5MB", function (value) {
      if (value && value.size) {
        return value.size <= 5 * 1024 * 1024;
      }
      return true;
    }),
  name: yup
    .string()
    .matches(
      /^[a-zA-Z][a-zA-Z\s()-]*[a-zA-Z)]$/,
      "Bank name must contain only letters, spaces, hyphens, and parentheses, and cannot start or end with a space, hyphen, or opening parenthesis"
    )
    .matches(/^(?!.*\s{2}).*$/, "Bank name cannot contain consecutive spaces")
    .matches(/^(?!.*-{2}).*$/, "Bank name cannot contain consecutive hyphens")
    .matches(/^(?!.*\(\)).*$/, "Bank name cannot contain empty parentheses")
    .max(60, "Bank name must be at most 60 characters long")
    .required("Please enter bank name"),
});

export const networkSchema = yup.object().shape({
  type: yup
    .string()
    .matches(
      /^[a-zA-Z][a-zA-Z\s()-]*[a-zA-Z)]$/,
      "Network type must contain only letters, spaces, hyphens, and parentheses, and cannot start or end with a space, hyphen, or opening parenthesis"
    )
    .matches(
      /^(?!.*\s{2}).*$/,
      "Network type cannot contain consecutive spaces"
    )
    .matches(
      /^(?!.*-{2}).*$/,
      "Network type cannot contain consecutive hyphens"
    )
    .matches(/^(?!.*\(\)).*$/, "Network type cannot contain empty parentheses")
    .max(60, "Network type must be at most 60 characters long")
    .required("Please enter network type"),
});

export const cardFormSchema = yup.object().shape({
  cardName: yup
    .string()
    .matches(
      /^[a-zA-Z0-9+][a-zA-Z0-9\s()+-]*[a-zA-Z0-9)]$/,
      "Card name must contain only letters, numbers, spaces, hyphens, and parentheses, and cannot start or end with a space, hyphen, or opening parenthesis"
    )
    .matches(/^(?!.*\s{2}).*$/, "Card name cannot contain consecutive spaces")
    .matches(/^(?!.*-{2}).*$/, "Card name cannot contain consecutive hyphens")
    .matches(/^(?!.*\(\)).*$/, "Card name cannot contain empty parentheses")
    .max(60, "Card name must be at most 60 characters long")
    .required("Please enter card name"),
  network: yup.string().required("Network type is required"),
  cardType: yup.string().required("Card type is required"),
  image: yup
    .mixed()
    .required("Card image is required")
    .test("fileType", "Only image file is allowed", function (value) {
      if (typeof value === "string") {
        const urlPattern = /^(http|https):\/\/[^ "]+$/;
        const extensionPattern = /\.(jpg|jpeg|png|gif|webp|heic|heif)$/;
        return urlPattern.test(value) && extensionPattern.test(value);
      } else if (value && value.type) {
        return value.type.startsWith("image/");
      }
      return false;
    })
    .test("fileSize", "Image size must be under 5MB", function (value) {
      if (value && value.size) {
        return value.size <= 5 * 1024 * 1024;
      }
      return true;
    }),
  bank: yup
    .string()
    .nullable()
    .test(
      "bank",
      "Bank is required when card type is Debit or Credit Card",
      function (value) {
        const { cardType } = this.parent;
        if (cardType === "debit" || cardType === "credit") {
          return !!value?.trim();
        }
        return true;
      }
    ),
  benefits: yup
    .string()
    .required("Please enter benefits")
    .test("benefits", "Please enter benefits", (value) => {
      return value && value !== "<p><br></p>";
    }),
});

export const outletFormSchema = yup.object().shape({
  image: yup
    .mixed()
    .required("Outlet image is required")
    .test("fileType", "Only image file is allowed", function (value) {
      if (typeof value === "string") {
        const urlPattern = /^(http|https):\/\/[^ "]+$/;
        const extensionPattern = /\.(jpg|jpeg|png|gif|webp|heic|heif)$/;
        return urlPattern.test(value) && extensionPattern.test(value);
      } else if (value && value.type) {
        return value.type.startsWith("image/");
      }
      return false;
    })
    .test("fileSize", "Image size must be under 5MB", function (value) {
      if (value && value.size) {
        return value.size <= 5 * 1024 * 1024;
      }
      return true;
    }),
  outletName: yup
    .string()

    .matches(/^(?!.*\s{2}).*$/, "Outlet name cannot contain consecutive spaces")

    .max(60, "Outlet name must be at most 60 characters long")
    .required("Please enter outlet name"),
  city: yup.string().required("Please select city"),
  address: yup.string().required("Please select address"),
  about: yup.string().required("Please enter description"),
});

export const offerFormSchema = yup.object().shape({
  ad_image: yup
    .mixed()
    .nullable()
    .test("ad_image", "Advertisement image is required", function (value) {
      const { is_advertisement } = this.parent;
      if (is_advertisement === 1) {
        return !!value;
      }
      return true;
    })
    .test("fileType", "Only image file is allowed", function (value) {
      const { is_advertisement } = this.parent;
      if (is_advertisement === 1 && value) {
        if (typeof value === "string") {
          const urlPattern = /^(http|https):\/\/[^ "]+$/;
          const extensionPattern = /\.(jpg|jpeg|png|gif|webp|heic|heif)$/;
          return urlPattern.test(value) && extensionPattern.test(value);
        } else if (value.type) {
          return value.type.startsWith("image/");
        }
        return false;
      }
      return true;
    })
    .test("fileSize", "Image size must be under 5MB", function (value) {
      const { is_advertisement } = this.parent;
      if (is_advertisement === 1 && value && value.size) {
        return value.size <= 5 * 1024 * 1024;
      }
      return true;
    }),

  category: yup.string().required("Please select category"),
  card_id: yup
    .array()
    .min(1, "Please select at least one card")
    .required("Please select at least one card"),
  outlet: yup.string().required("Please select outlet"),
  details: yup.string().required("Please enter offer details"),
  other_detail: yup
    .string()
    .required("Please enter terms & conditions")
    .test("other_detail", "Please enter terms & conditions", (value) => {
      return value && value !== "<p><br></p>";
    }),
  // end_date: yup.date().required("Please enter end date"),
});

export const isEditOfferFormSchema = yup.object().shape({
  ad_image: yup
    .mixed()
    .nullable()
    .test("ad_image", "Advertisement image is required", function (value) {
      const { is_advertisement } = this.parent;
      if (is_advertisement === 1) {
        return !!value;
      }
      return true;
    })
    .test("fileType", "Only image file is allowed", function (value) {
      const { is_advertisement } = this.parent;
      if (is_advertisement === 1 && value) {
        if (typeof value === "string") {
          const urlPattern = /^(http|https):\/\/[^ "]+$/;
          const extensionPattern = /\.(jpg|jpeg|png|gif|webp|heic|heif)$/;
          return urlPattern.test(value) && extensionPattern.test(value);
        } else if (value.type) {
          return value.type.startsWith("image/");
        }
        return false;
      }
      return true;
    })
    .test("fileSize", "Image size must be under 5MB", function (value) {
      const { is_advertisement } = this.parent;
      if (is_advertisement === 1 && value && value.size) {
        return value.size <= 5 * 1024 * 1024;
      }
      return true;
    }),

  category: yup.string().required("Please select category"),
  card_id: yup.string().required("Please select card"),
  outlet: yup.string().required("Please select outlet"),
  details: yup.string().required("Please enter offer details"),
  other_detail: yup
    .string()
    .required("Please enter terms & conditions")
    .test("other_detail", "Please enter terms & conditions", (value) => {
      return value && value !== "<p><br></p>";
    }),
  // end_date: yup.date().required("Please enter end date"),
});

export const UsersSchema = yup.object().shape({
  firstName: yup
    .string()
    .matches(/^[a-zA-Z\s]*$/, "First name cannot contain special characters")
    .required("Please enter first name"),
  lastName: yup
    .string()
    .matches(/^[a-zA-Z\s]*$/, "Last name cannot contain special characters")
    .required("Please enter last name"),
  contactNo: yup
    .string()
    .required("Please enter a valid contact number")
    .matches(/^\d{10}$/, "Contact number must be exactly 10 digits"),
});

export const profileSchema = yup.object().shape({
  first_name: yup
    .string()
    .matches(/^[a-zA-Z\s]*$/, "First name cannot contain special characters")
    .required("Please enter first name"),
  last_name: yup
    .string()
    .matches(/^[a-zA-Z\s]*$/, "Last name cannot contain special characters")
    .required("Please enter last name"),
  contact_no: yup
    .string()
    .matches(/^\d{10}$/, "Contact number must be exactly 10 digits"),
});

export const notificationSchema = yup.object().shape({
  title: yup.string().required("Please enter title"),
  subTitle: yup.string().required("Please enter subTitle"),
  message: yup.string().required("Please enter message"),
  userType: yup.string().required("Please select user"),
  users: yup
    .array()
    .nullable()
    .min(1, "Please select at least one user")
    .required("Please select user")
    .test(
      "users",
      "User is required when userType is 'particular_Users'",
      function (value) {
        const { userType } = this.parent;
        if (userType === "particular_Users") {
          return Array.isArray(value) && value.length > 0;
        }
        return true;
      }
    ),
});

export const fileCSVSchema = yup.object().shape({
  file: yup.mixed().required("CSV file is required"),
});

export const termsSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup
    .string()
    .required("Description is required")
    .test("description", "Please enter description", (value) => {
      return value && value !== "<p><br></p>";
    }),
});
export const engagementSchema = yup.object().shape({
  link: yup
    .string()
    .url("Please enter a valid URL"),
  description: yup.string().required("Description is required"),
});
