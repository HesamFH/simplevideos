const yup = require("yup");

//! User validation schema

exports.userValidationSchema = yup.object().shape({
  username: yup
    .string()
    .required("نام کاربری اجباری می باشد")
    .min(3, "نام کاربری باید حداقل شامل 3 حرف باشد")
    .max(50, "نام کاربری می تواند حداکثر 50 حرف باشد"),
  email: yup
    .string()
    .email("ایمیل معتبر نمی باشد")
    .required("ایمیل اجباری است"),
  password: yup
    .string()
    .required("کلمه عبور اجباری می باشد")
    .min(6, "کلمه عبور باید حداقل 6 حرف باشد")
    .max(255, "کلمه عبور می تواند حداکثر 255 حرف باشد"),
  confirmPassword: yup.string().required("تکرار کلمه عبور اجباری است"),
});
