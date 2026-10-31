
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { loginUser } from "./authslice";


// -------------------------
// Zod validation schema
// -------------------------
const schema = z.object({
  email: z
    .string()
    .email("Please enter a valid email"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must not exceed 20 characters")
});


// -------------------------
// Login Component
// -------------------------
function Login() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );


  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema)
  });


  // Redirect after successful login
  useEffect(() => {

    if (isAuthenticated) {
      navigate("/");
    }

  }, [isAuthenticated, navigate]);


  // Form submission
  const onSubmit = (data) => {

    console.log(data);

    dispatch(loginUser(data));

  };


  return (

    <div className="min-h-screen flex items-center justify-center bg-base-200">

      <div className="card w-96 bg-base-100 shadow-2xl">

        <div className="card-body">

          <h2 className="text-3xl font-bold text-center mb-5">
            Login
          </h2>


          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>


            {/* Email */}
            <div className="form-control">

              <label className="label">
                <span className="label-text font-semibold">
                  Email
                </span>
              </label>

              <input
                type="email"
                placeholder="ravi@gmail.com"
                className={`input input-bordered w-full ${
                  errors.email ? "input-error" : ""
                }`}
                {...register("email")}
              />

              {errors.email && (

                <label className="label">

                  <span className="label-text-alt text-error">
                    {errors.email.message}
                  </span>

                </label>

              )}

            </div>


            {/* Password */}
            <div className="form-control mt-3">

              <label className="label">

                <span className="label-text font-semibold">
                  Password
                </span>

              </label>

              <input
                type="password"
                placeholder="Enter your password"
                className={`input input-bordered w-full ${
                  errors.password ? "input-error" : ""
                }`}
                {...register("password")}
              />

              {errors.password && (

                <label className="label">

                  <span className="label-text-alt text-error">
                    {errors.password.message}
                  </span>

                </label>

              )}

            </div>


            {/* Server Error */}
            {error && (

              <div className="alert alert-error mt-4">

                <span>{error}</span>

              </div>

            )}


            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full mt-5"
            >

              {loading ? (

                <>
                  <span className="loading loading-spinner"></span>
                  Logging in...
                </>

              ) : (

                "Login"

              )}

            </button>

          </form>


          {/* Signup */}
          <p className="text-center mt-5">

            Don't have an account?{" "}

            <button
              type="button"
              className="link link-primary font-semibold"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </button>

          </p>

        </div>

      </div>

    </div>

  );
}

export default Login;
