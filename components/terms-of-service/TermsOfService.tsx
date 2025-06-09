"use client";

export default function TermsOfService() {
  return (
    <div className="flex-1 flex-col p-4 lg:py-12 lg:px-8 border-b rounded-md">
      <div className="max-full mx-auto space-y-8 p-4 bg-white">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            TERMS AND CONDITIONS
          </h1>
          <p className="text-sm text-gray-600 italic">
            last updated on 12.05.2025
          </p>
        </div>

        {/* Introduction */}
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 leading-relaxed">
            These Terms and Conditions ("Terms") are designed to govern your
            relationship with aroundchess and its subsidiaries, branches and
            affiliates (together referred to as "we", "us" or "aroundchess").
            The below provisions are set forth to set conditions under which
            aroundchess makes available its internet website{" "}
            <span className="font-medium">www.aroundchess.com</span> (the
            "Website") and/or the services available via the Website or
            otherwise to each individual or entity (each a "User" or "you")
            accessing the Website and/or using our services such as mobile
            applications ("Apps").
          </p>

          <p className="text-gray-700 leading-relaxed mt-4">
            aroundchess is a brand name used exclusively by aroundchess AG,
            registered in Switzerland with registration nr. CH-170-3051046-9
            (the "Legal Entity"). The Website and content available on the
            website is seen as commercial information provided by the Legal
            Entity. These Terms apply to all Users regardless of their location
            and nationality to the maximum extent permissible under applicable
            law.
          </p>

          <p className="text-gray-700 leading-relaxed mt-4">
            By accessing/registering/using the Website and/or our app services
            you agree to be bound by these Terms. These Terms may be amended
            from time to time and you agree to read these carefully and monitor
            the amendments that will be published on this page in case of any
            amendments. If you do not agree to be bound by these Terms, you
            should leave the Website and discontinue using the services
            immediately.
          </p>
        </div>

        {/* Scope of Services */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            SCOPE OF SERVICES
          </h2>

          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              aroundchess offers services via an online platform available at
              the website address:{" "}
              <span className="font-medium">www.aroundchess.com</span> and the
              mobile apps in the Appstore and Google Playstore. aroundchess is
              designed for chess enthusiasts for them to be able to request a
              report for the games he/she played on the websites where it is
              possible to play chess. For details on the list of websites
              available for reporting purposes, please refer to our Website on
              contact us.
            </p>

            <p className="text-gray-700 font-medium">
              Users are provided with the following services on the Website:
            </p>

            <ol className="space-y-3 pl-6">
              <li className="text-gray-700">
                <span className="font-medium">1.</span> Users can access the
                Website and get authorized with login and password, or can get
                authorized via social networks available on the Website.
              </li>
              <li className="text-gray-700">
                <span className="font-medium">2.</span> Users can provide the
                name of a website(s) where they have played chess and their
                username used on that website.
              </li>
              <li className="text-gray-700">
                <span className="font-medium">3.</span> aroundchess collects the
                details of chess matches played on these chess websites through
                public API.
              </li>
              <li className="text-gray-700">
                <span className="font-medium">4.</span> Using its algorithms
                aroundchess analyzes your chess matches and provides
                personalized reports based on the performance in the played
                matches.
              </li>
              <li className="text-gray-700">
                <span className="font-medium">5.</span> Your reports are then
                saved and stored on aroundchess website for your further
                reference and use.
              </li>
            </ol>
          </div>
        </section>

        {/* Registration and Subscription */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            REGISTRATION AND SUBSCRIPTION
          </h2>

          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              In order to get access to the services, you will be required to
              register and create an account by choosing username/login and
              password, or authorize via any of the social networks connected to
              the Website. You will be asked to provide additional details for
              your account on our Website such as email address, full name, etc.
            </p>

            <p className="text-gray-700 leading-relaxed">
              You are responsible for keeping your password in confidentiality.
              You agree not to use the account, username, or password of another
              User at any time, or to disclose your password to any third party.
              You acknowledge and agree that you are solely responsible for any
              use of your account and all activities occurring in connection
              with the use of your account.
            </p>

            <p className="text-gray-700 leading-relaxed">
              By registering and creating an account at our Website you warrant
              and represent that any information provided by you at the time of
              registration, including any billing information, is complete,
              truthful and accurate, and you agree to your obligation to keep
              such information up to date.
            </p>

            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 font-medium mb-4">
                Aroundchess offers three types of accounts, subscription or
                token models:
              </p>

              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    a. Basic Free Account
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    The basic free-of-charge subscription, which allows you to
                    access the platform and request up to 1 (one) analysis token
                    per 3 (three) days. Each game analysis token enables the
                    user to exactly 1 (one) chess game analysis. Free analyses
                    tokens cannot be accumulated, also not if the free game
                    analysis token has not been used within the 3 (three)
                    aforementioned days.
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    b. Paid Yearly Subscription
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Paid yearly subscription with which the User can use up
                    1.000 game analysis tokens within a year starting with the
                    date of subscription. Users on the paid yearly subscription
                    are not entitled to free game analysis tokens as described
                    in "a.".
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    c. Individual Game Analysis Tokens
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Game Analysis Tokens that can be purchased in individual
                    amounts by both users of the free-of-charge subscription as
                    well as the paid yearly subscription. One Game Analysis
                    token can be used for one chess game analysis.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed">
              By registering and using an account on the Website, User provides
              his consent to receive occasional promotional & advertising
              content from aroundchess. Should the User decide to withdraw
              his/her consent, he/she can contact aroundchess with this request
              at any moment.
            </p>
          </div>
        </section>

        {/* Subscription Fees */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            SUBSCRIPTION FEES AND FAIL TO DELIVER
          </h2>

          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              User acknowledges that irrespective of whether he/she has a free
              or a paid subscription, the services of the Company may be
              interrupted due to IT or other software malfunctions. If a User
              has paid monthly or annual subscription fees of aroundchess, yet
              the Website is not generating the required game analyses due to
              public API malfunctions or total stop of functioning - aroundchess
              shall cancel paid subscription(s) and will not deduct any further
              charges. However, the User agrees and confirms that the already
              paid fees will not be refunded.
            </p>

            <p className="text-gray-700 leading-relaxed">
              If the Website is not generating the required analyses due to
              public API being temporarily down - the User agrees and confirms
              that the temporary fail to deliver the services to the User will
              not result in partial or full refunds, and the User agrees to wait
              for up to 5 (five) working days until the services are restored.
            </p>
          </div>
        </section>

        {/* User Conduct */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            USER CONDUCT
          </h2>

          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              You shall be responsible for all your interactions with other
              users of the Website and/or our Services. aroundchess shall not be
              responsible for any damage or harm resulting from your interaction
              with other users of the Website and/or our Services.
            </p>

            <p className="text-gray-700 font-medium">
              Each user has the following restrictions in connection to use of
              our Website and/or services:
            </p>

            <ul className="space-y-3 pl-6">
              <li className="text-gray-700 flex items-start">
                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                User cannot sell, distribute, copy, duplicate, or otherwise
                reproduce all or any part of the Website and services and/or any
                content of the Website.
              </li>
              <li className="text-gray-700 flex items-start">
                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                User cannot use the Website for any illegal, immoral or
                unauthorized purpose.
              </li>
              <li className="text-gray-700 flex items-start">
                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                User cannot modify the Website or interfere with its underlying
                software or technology.
              </li>
              <li className="text-gray-700 flex items-start">
                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                User acknowledges that he/she can create only one account with
                aroundchess.
              </li>
              <li className="text-gray-700 flex items-start">
                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                User agrees not to use the Website and services in a way that
                infringes or violates these Terms.
              </li>
            </ul>
          </div>
        </section>

        {/* Limitation of Liability */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            LIMITATION OF LIABILITY
          </h2>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 space-y-4">
            <p className="text-gray-700 leading-relaxed">
              We make no representation or warranties about the suitability,
              reliability, security, correctness, availability, timeliness and
              accuracy of the services or their content. We expressly disclaim
              any warranties or conditions, express or implied.
            </p>

            <p className="text-gray-700 leading-relaxed">
              To the maximum extent permitted by the applicable law, aroundchess
              shall not be liable for any indirect, incidental, special,
              consequential or punitive damages, as well as any loss of profits
              or revenues of any kind, whether incurred directly or indirectly.
            </p>

            <p className="text-gray-700 leading-relaxed">
              Use of our Website, the content and the services obtained from or
              through the Website is fully at your own risk. You fully accept
              the risks and you agree that you will have no recourse to seek
              damages against us even if you suffer loss or damage from using
              our Website and associated services.
            </p>
          </div>
        </section>

        {/* Privacy Policy */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            PRIVACY POLICY
          </h2>

          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              aroundchess collects the following personal data of each user:
              full name and surname, email address, usernames and some
              private/game data on the websites where Users have played chess
              ("Personal Data").
            </p>

            <p className="text-gray-700 leading-relaxed">
              Your email address will be used as a contact method for
              communication between yourself and aroundchess. Your Personal Data
              will not be sold, traded or rented to third parties. We only share
              Personal Data with third parties in connection with the provision
              of the services to our Users.
            </p>

            <p className="text-gray-700 leading-relaxed">
              All reports or game analyses provided to you by aroundchess are
              confidential. Third parties will not have access to your reports
              or game analyses unless you explicitly consent to share these to
              the public by clicking on the "share" button.
            </p>

            <p className="text-gray-700 italic text-sm">
              For more detailed privacy provisions please refer to our Privacy
              Policy.
            </p>
          </div>
        </section>

        {/* Miscellaneous Terms */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            MISCELLANEOUS TERMS
          </h2>

          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              You understand, acknowledge and accept that the services and the
              Website are currently under testing and some of the
              services/features may not be available at all times.
            </p>

            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed by the laws of Switzerland without
              reference to its choice or conflict of law principles. You agree
              that all such claims and disputes will be heard and resolved
              exclusively in state courts located in Switzerland.
            </p>

            <p className="text-gray-700 leading-relaxed">
              You agree to indemnify, defend and hold aroundchess harmless from
              any and all claims, liabilities, expenses and damages, including
              reasonable attorneys' fees and costs, made by any third party
              related to your use of the services in violation of these Terms.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="space-y-6 border-t pt-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            CONTACT US
          </h2>

          <div className="text-center">
            <p className="text-gray-700 leading-relaxed">
              If you have any questions, comments, concerns or any feedback
              about our services, please contact our Support Team via{" "}
              <a
                href="mailto:xyz@aroundchess.com"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                xyz@aroundchess.com
              </a>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
