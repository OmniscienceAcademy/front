/* eslint-disable jsx-a11y/interactive-supports-focus */
import Style from "@styles/components/Layout/CookieConsent.module.scss";
import Link from "next/link";
import { handleEnterKeyDown } from "@common/utils";

export interface CookieConsentProps {
  onAccept?: (accepted: boolean) => void;
}

export default function CookieConsent({ onAccept }: CookieConsentProps) {
  return (
    <div className={Style.cookieWrapper}>
      <div className={Style.cookieWrapperInner}>
        <div className={Style.cookieText}>
          <p>
            This website uses cookies to ensure you get the best experience on
            our website.
          </p>
          <p>By continuing to use this site you agree to our use of cookies.</p>
        </div>
        <div className={Style.cookieButtonsWrapper}>
          <div
            onClick={onAccept && (() => onAccept(false))}
            role="button"
            className={Style.cookieDecline}
            onKeyDown={onAccept && handleEnterKeyDown(() => onAccept(false))}
          >
            Decline
          </div>
          <div
            onClick={onAccept && (() => onAccept(true))}
            role="button"
            className={Style.cookieAccept}
            onKeyDown={onAccept && handleEnterKeyDown(() => onAccept(true))}
          >
            Got it!
          </div>
          <Link href="/#">
            <div role="button" className={Style.cookieLearnMore}>
              Learn more
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
