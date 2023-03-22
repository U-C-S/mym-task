import React, { useEffect } from "react";

import { useRouter } from "next/router";

function GoogleLogin() {
  const router = useRouter();

  useEffect(() => {
    const { code } = router.query;
    if (code) {
      fetch(process.env.NEXT_PUBLIC_API_URL + "/googlelogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: code,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          localStorage.setItem("token", data.token);
          router.push("/home");
        });
    }
  }, [router.query]);

  return <div>Logging in with google</div>;
}

export default GoogleLogin;
