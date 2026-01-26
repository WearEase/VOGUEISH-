"use client";

import { JSX } from "react";
import BuyerSignIn from "./BuyerSignIn";
import BuyerSignUp from "./BuyerSignUp";
import SellerSignIn from "./SellerSignIn";
import SellerSignUp from "./SellerSignUp";
import { FormType } from "@/types/authTypes";

interface AuthFormProps {
  type: FormType;
}

const formComponents: Record<FormType, JSX.Element> = {
  "buyer-sign-in": <BuyerSignIn />,
  "buyer-sign-up": <BuyerSignUp />,
  "seller-sign-in": <SellerSignIn />,
  "seller-sign-up": <SellerSignUp />,
};

const AuthForm = ({ type }: AuthFormProps) => {
  return formComponents[type] ?? <div>Invalid form type</div>;
};

export default AuthForm;
