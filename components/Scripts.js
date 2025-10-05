import Script from "next/script";
import { useConfig } from "@/lib/config";

const Scripts = () => {
  const BLOG = useConfig();

  return (
    <>
      {BLOG.analytics && BLOG.analytics.provider === "ackee" && (
        <Script
          src={BLOG.analytics.ackeeConfig.tracker}
          data-ackee-server={BLOG.analytics.ackeeConfig.dataAckeeServer}
          data-ackee-domain-id={BLOG.analytics.ackeeConfig.domainId}
        />
      )}
      {BLOG.analytics && BLOG.analytics.provider === "ga" && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${BLOG.analytics.gaConfig.measurementId}`}
          />
          <Script strategy="lazyOnload" id="ga">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${BLOG.analytics.gaConfig.measurementId}', {
                page_path: window.location.pathname,
              });`}
          </Script>
        </>
      )}
      {BLOG.analytics?.clarityConfig?.clarityId && (
        // <Script
        //   strategy="afterInteractive"
        //   id="clarity"
        //   dangerouslySetInnerHTML={{
        //     __html: `(function(c,l,a,r,i,t,y){
        //   c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        //   t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        //   y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        // })(window, document, "clarity", "script", "tiyegorg69");`,
        //   }}
        // />
        <Script
          id="clarity-loader"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
          window.clarity = window.clarity || function() {
            (window.clarity.q = window.clarity.q || []).push(arguments);
          };

          !function(c, l, a, r, i, t, y) {
            a[c]("metadata", function() {
              a[c]("set", "C_IS", "0");
            }, !1, !0);

            if (a[c].v || a[c].t) {
              return a[c]("event", c, "dup." + i.projectId);
            }

            a[c].t = !0;
            t = l.createElement(r);
            t.async = !0;
            t.src = "https://scripts.clarity.ms/0.8.30/clarity.js";
            y = l.getElementsByTagName(r)[0];
            y.parentNode.insertBefore(t, y);
            a[c]("start", i);
            a[c].q.unshift(a[c].q.pop());
            a[c]("set", "C_IS", "0");
          }("clarity", document, window, "script", {
            "projectId": "tiyegorg69",
            "upload": "https://q.clarity.ms/collect",
            "expire": 365,
            "cookies": ["_uetmsclkid", "_uetvid"],
            "track": true,
            "content": true,
            "dob": 2104
          });
        `,
          }}
        />
      )}
    </>
  );
};

export default Scripts;
