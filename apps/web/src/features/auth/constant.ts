import {
  GoogleIcon,
  GithubIcon,
  DiscordIcon,
} from "./components/social-auth.icon";
import { IconType, SupportedOauthProviders } from "./type";

export const SUCCESS_CALLBACK_URL = "/home";
export const ERROR_CALLBACK_URL = "/auth/signin";

export const SUPPORTED_OAUTH_PROVIDERS = [
  "google",
  "github",
  "discord",
] as const;

export const SUPPORTED_OAUTH_PROVIDERS_DETAILS: Record<
  SupportedOauthProviders,
  {
    name: string;
    Icon: IconType;
    style: string;
    IconStyle?: string;
  }
> = {
  google: {
    name: "Google",
    Icon: GoogleIcon,
    style: "bg-blue-600 hover:bg-blue-600 hover:opacity-95 dark:text-white",
  },
  github: {
    name: "GitHub",
    Icon: GithubIcon,
    style: "bg-black hover:opacity-95 dark:text-white hover:dark:bg-white/2",
  },
  discord: {
    name: "Discord",
    Icon: DiscordIcon,
    style: "bg-indigo-700 hover:bg-indigo-700 hover:opacity-95 dark:text-white",
  },
};

export const AUTH_CONFIG = {
  signin: {
    title: "Sign in to your account",
    question: "Don't have an account?",
    linkText: "Sign up",
    linkHref: "/auth/sign-up",
    greetings: "Welcome back!",
  },
  signup: {
    title: "Create an account",
    question: "Already have an account?",
    linkText: "Sign in",
    linkHref: "/auth/sign-in",
    greetings: "Join us today!",
  },
} as const;
