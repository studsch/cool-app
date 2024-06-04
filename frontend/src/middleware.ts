import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";

const locales = ["en", "ru"];
const nonPublicPages = ["/profile"];

const intlMiddleware = createIntlMiddleware({
  locales,
  localePrefix: "as-needed",
  defaultLocale: "ru",
});

export default async function middleware(
  req: NextRequest,
  event: NextFetchEvent,
) {
  console.log(req.url);
  const regexEnter = /^(ru|en)\/enter(\/.*)?|enter(\/.*)?$/;
  const regexRegister = /^(ru|en)\/register(\/.*)?|\/register(\/.*)?$/;
  const token = await getToken({ req });
  console.log(regexEnter.test(req.nextUrl.pathname));
  const isAuthenticated = !!token;
  console.log(isAuthenticated);
  if (
    (regexEnter.test(req.nextUrl.pathname) ||
      regexRegister.test(req.nextUrl.pathname)) &&
    isAuthenticated
  ) {
    // let tmp_pref = "ru";
    // if (req.nextUrl.pathname.startsWith("/en/")) tmp_pref = "en";
    // return NextResponse.redirect(
    //   new URL(`${tmp_pref}/profile`, req.url.replace("en/", "")),
    // );
    return NextResponse.redirect(new URL("/profile", req.url));
  } else if (
    (regexRegister.test(req.nextUrl.pathname) ||
      regexEnter.test(req.nextUrl.pathname)) &&
    !isAuthenticated
  ) {
    console.log("dasdas");
    return intlMiddleware(req);
  }
  const nonPublicPathnameRegex = RegExp(
    `^(/(${locales.join("|")}))?(${nonPublicPages
      .flatMap(p => (p === "/" ? ["", "/"] : p))
      .join("|")})/?$`,
    "i",
  );
  const isNonPublicPage = nonPublicPathnameRegex.test(req.nextUrl.pathname);
  if (isNonPublicPage) {
    const authMiddleware = await withAuth(
      // Note that this callback is only invoked if
      // the `authorized` callback has returned `true`
      // and not for pages listed in `pages`.
      function onSuccess(req) {
        return intlMiddleware(req);
      },
      {
        callbacks: {
          authorized: ({ token }) => token != null,
        },
        pages: {
          signIn: "/enter",
          newUser: "/register/:path*",
        },
      },
    );
    return (authMiddleware as any)(req);
  } else {
    return intlMiddleware(req);
  }
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
