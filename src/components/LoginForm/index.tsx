"use client";

import { useState, useContext } from "react";
import { UserContext } from "@/context/user";
import { validateSignin } from "@/app/utils/validation";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import SignUpWithGoogle from "../SignUpGoogle";
import Link from "next/link";
import { postSignIn } from "@/app/lib/server/fetchUsers";

function SignInForm() {
  const router = useRouter();
  const { signIn } = useContext(UserContext);

  // Estado para manejar los valores del formulario, errores y si los campos han sido tocados
  const [signinValues, setSigninValues] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({} as { [key: string]: string });
  const [touched, setTouched] = useState({} as { [key: string]: boolean });

  // Maneja los cambios en los campos y valida en tiempo real
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSigninValues({ ...signinValues, [name]: value });

    // Si el campo ha sido tocado, valida y actualiza los errores
    if (touched[name]) {
      setErrors(validateSignin({ ...signinValues, [name]: value }));
    }
  };

  // Maneja cuando un campo es "tocado" (cuando el usuario hace clic en él)
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });

    // Validar el campo cuando es tocado
    setErrors(validateSignin(signinValues));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(signinValues)

    const success = await postSignIn(signinValues);

    if (success) {
      Swal.fire({
        icon: "success",
        title: "Signed in successfully",
        position: "top-end",
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      router.push("/home");
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid Credentials",
        position: "top-end",
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  return (
    <form
      className="max-w-lg mx-auto m-10 p-6 bg-white rounded-lg shadow-lg"
      onSubmit={handleSubmit}
    >
      {" "}
      <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
      {/** Email field */}
      <div className="relative z-0 w-full mb-6 group">
        <input
          type="email"
          name="email"
          id="email"
          value={signinValues.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className="block py-3 px-2 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
        />
        <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
          Email Address
        </label>
        {touched.email && errors.email && (
          <span className="text-red-500 text-xs mt-1">{errors.email}</span>
        )}
      </div>
      {/** Password field */}
      <div className="relative z-0 w-full mb-6 group">
        <input
          type="password"
          name="password"
          id="password"
          value={signinValues.password}
          onChange={handleChange}
          onBlur={handleBlur}
          className="block py-3 px-2 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
        />
        <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
          Password
        </label>
        {touched.password && errors.password && (
          <span className="text-red-500 text-xs mt-1">{errors.password}</span>
        )}
      </div>
      {/** Submit button */}
      <button
        type="submit"
        disabled={Object.keys(errors).length > 0}
        className="w-full py-3 px-5 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 rounded-lg text-sm font-medium transition"
      >
        Submit
      </button>
      <h2 className="font-bold p-3 text-center">Or</h2>
      <div className="text-center">
        <SignUpWithGoogle />
      </div>
      <div className="flex flex-col items-center mt-6">
        <h1 className="text-xl font-semibold text-gray-700">
          You don't have an account?
          <Link
            href="/registerAs"
            className="text-[#FA7070] hover:text-[#B94F4F] ml-2 transition-colors duration-300"
          >
            Register
          </Link>
        </h1>
      </div>
    </form>
  );
}

export default SignInForm;
