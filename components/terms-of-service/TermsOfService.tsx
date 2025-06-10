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
            last updated on 05.06.2025
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
            registered in Switzerland with registration nr. CHE-222.910.638 (the
            "Legal Entity"). The Website and content available on the website is
            seen as commercial information provided by the Legal Entity. These
            Terms apply to all Users regardless of their location and
            nationality to the maximum extent permissible under applicable law.
          </p>

          <p className="text-gray-700 leading-relaxed mt-4">
            By accessing/registering/using the Website and/or our app services
            you agree to be bound by these Terms. These Terms may be amended
            from time to time and you agree to read these carefully and monitor
            the amendments that will be published on this page in case of any
            amendments. If you do not agree to be bound by these Terms, you
            should leave the Website and discontinue using the services
            immediately. As long as you do not cease using our services, you
            will be conclusively deemed to have accepted these Terms.
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
              password, or authorized via any of the social networks connected
              to the Website. You will be asked to provide additional details
              for your account on our Website such as email address, full name,
              etc.
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
                    user to exactly 1 (one) chess game analysis. Free analysis
                    tokens cannot be accumulated, also not if the free game
                    analysis token has not been used within the 3 (three)
                    aforementioned days. If a user purchases individual game
                    analysis tokens, the user will not receive additional free
                    game analysis tokens until the purchased game analysis
                    tokens are fully used. Once the purchased game analysis
                    tokens are fully used, the user will again be entitled to 1
                    (one) free game analysis token per 3 (three) days. Apart
                    from receiving 1 (one) free Game Analysis Token per 3 days,
                    free users can also play up to 20 Puzzles per month and
                    receive limited access to the feedback log and game history.
                    The scope of the free-of-charge subscription can change
                    anytime without prior notice.
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    b. Paid Yearly Subscription
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Paid yearly subscription with which the User can use up 1000
                    game analysis tokens within a year starting with the date of
                    subscription. Users on the paid yearly subscription are not
                    entitled to free game analysis tokens as described in "A.".
                    Within their subscription, Users of the paid yearly
                    subscription can play unlimited puzzles and can access the
                    games in the feedback log and game history that they have
                    previously analyzed by the use of Tokens. In general, only
                    Games that have previously been analyzed by the use of
                    Tokens can be accessed in the feedback log and game history.
                    Once users of the paid yearly subscription run out of Game
                    Analysis Tokens, they have the option to purchase additional
                    tokens or get in contact with the AroundChess team via email
                    through contact@aroundchess.com for individual package
                    options.
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
                    token can be used for one chess game analysis. If a user
                    purchases individual game analysis tokens, the user will not
                    receive additional free game analysis tokens as described in
                    "A." until the purchased game analysis tokens are fully
                    used. Once the purchased game analysis tokens are fully
                    used, the user will again be entitled to 1 (one) free game
                    analysis token per 3 (three) days.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed">
              Users can access paid subscriptions by signing up and making
              corresponding yearly payments that will allow Users to access the
              platform and increase the limit for the amount of game analyses.
              All matches are analyzed by our platform and third party tools.
            </p>

            <p className="text-gray-700 leading-relaxed">
              By registering and using an account on the Website, User provides
              his consent to receive occasional promotional & advertising
              content from aroundchess. Should the User decide to withdraw
              his/her consent, he/she can contact aroundchess with this request
              at any moment.
            </p>

            <p className="text-gray-700 leading-relaxed">
              If your billing information and payment source you provided while
              registering for a subscription is invalid, if charges billed to
              you are declined or not paid or if you fail to pay charges when
              due, your account may be suspended or cancelled at our sole
              discretion.
            </p>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <p className="text-gray-700 font-medium mb-2">
                aroundchess reserves the right to:
              </p>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>
                  • Refuse to offer access to or use of the Website and services
                  to any User, and change its eligibility criteria at any time
                </li>
                <li>
                  • Terminate your account immediately and without prior notice
                  if you do not comply with these Terms
                </li>
                <li>
                  • Modify, suspend, or discontinue, temporarily or permanently,
                  the Services or any part thereof, or your access thereto, and
                  to modify, suspend or terminate the Website or any part
                  thereof, at its sole discretion at any time and from time to
                  time, without being obligated to provide prior notice
                </li>
              </ul>
              <p className="text-gray-700 text-sm mt-3">
                You agree to have no claim, complaint or demand against
                aroundchess for applying such changes or for failures incidental
                to such changes.
              </p>
            </div>
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
              public API (application program interface) of underlying websites
              (websites where the User was playing chess and from which the
              analysis report should be drawn) malfunctions or total stop of
              functioning - aroundchess shall cancel paid subscription(s) and
              will not deduct any further charges. However, the User agrees and
              confirms that the already paid fees will not be refunded.
            </p>

            <p className="text-gray-700 leading-relaxed">
              If the Website is not generating the required analyses due to
              public API (application program interface) of underlying websites
              (websites where the User was playing chess and from which the
              analysis report should be drawn) being temporary down - the User
              agrees and confirms that the temporary fail to deliver the
              services to the User will not result in partial or full refunds,
              and the User agrees to wait for up to 5 (five) working days until
              the services are restored. In case if the services are not
              restored in the designated time frame, the User shall be governed
              by the provision related to malfunctions or total stop of
              functioning (above).
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
                unauthorized purpose, encourages criminal behavior or conduct
                that would constitute a criminal offense under any law, or could
                give rise to civil liability or other lawsuit.
              </li>
              <li className="text-gray-700 flex items-start">
                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                User cannot in any way modify the Website or otherwise interfere
                with the Website, the services, their underlying software, or
                other technology, code, algorithm or other proprietary
                information of aroundchess in any manner, or disobey any
                requirements, procedures, policies, or regulations of networks
                connected to the Website or the services.
              </li>
              <li className="text-gray-700 flex items-start">
                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                User acknowledges that he/she can create only one account with
                aroundchess. Having more than one account for one User shall
                constitute the violation of these Terms, and may lead to
                permanent restriction for use of the services provided by
                aroundchess.
              </li>
              <li className="text-gray-700 flex items-start">
                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                User agrees not to use the Website and services in a way that
                infringes or violates these Terms, or infringes or violates the
                terms of other service providers.
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
              accuracy of the services or their content, and we expressly
              disclaim any warranties or conditions, express or implied. We give
              no warranty that you will obtain specific results by using our
              services.
            </p>

            <p className="text-gray-700 leading-relaxed">
              To the maximum extent permitted by the applicable law, aroundchess
              shall not be liable for any indirect, incidental, special,
              consequential or punitive damages, as well as any loss of profits
              or revenues of any kind, whether incurred directly or indirectly,
              or any loss of data, use, goodwill or other intangible losses
              resulted from your:
            </p>

            <ul className="space-y-2 text-gray-700 pl-4">
              <li>
                • Access to or use of (or inability to access or use) the
                services
              </li>
              <li>
                • Any conduct or content of any party, including without
                limitation any offensive or illegal conduct
              </li>
              <li>
                • Unauthorized access, use, or alteration of your content or
                information
              </li>
            </ul>

            <p className="text-gray-700 leading-relaxed">
              Use of our Website, the content and the services obtained from or
              through the Website is fully at your own risk. You fully accept
              the risks and you agree that you will have no recourse to seek
              damages against us even if you suffer loss or damage from using
              our Website and associated services. Laws of certain jurisdictions
              do not allow limitations on implied warranties or the exclusion or
              limitation of certain damages. If these laws apply to you, some or
              all of the above disclaimers, exclusions, or limitations may not
              be applicable to you.
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
              of the services to our Users, and we ensure that any recipient
              adheres to the same standard of privacy rules.
            </p>

            <p className="text-gray-700 leading-relaxed">
              We implement a variety of security measures to maintain the safety
              of your Personal Data as are customary in the industry with
              similar sites. Nevertheless, these security measures cannot fully
              eliminate security risks associated with personal information.
              Therefore, aroundchess shall not be liable for any damages caused
              by unauthorized access to your Personal Data and/or to your
              Account.
            </p>

            <p className="text-gray-700 leading-relaxed">
              You may be entitled under applicable law to request to review,
              amend, erase or restrict the processing of your Personal Data.
              Please note that in case you request to erase or restrict the
              processing of your Personal Data, your use of the Services may be
              restricted or disabled.
            </p>

            <p className="text-gray-700 leading-relaxed">
              All reports or game analyses provided to you by aroundchess are
              confidential, i.e. third parties will not have access to your
              reports or game analyses. You will not have access to the reports
              of other users of the Website unless they have consented to share
              these to the public. Each user of the Website will have the
              opportunity to share his/her reports to the public, thus making it
              available to other users. To make the reports public, the user
              must explicitly consent to it by clicking on the button "share".
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
              services/features of the services may not be available at all
              times.
            </p>

            <p className="text-gray-700 leading-relaxed">
              These Terms shall be regarded as the entire agreement between you
              as the Customer and aroundchess with respect to use of the
              aroundchess website, superseding any prior agreement between you
              and aroundchess regarding the use of our Website.
            </p>

            <p className="text-gray-700 leading-relaxed">
              In case it appears that a particular provision of these Terms is
              not enforceable, this shall not affect the other terms of this
              agreement. If any provision of the Terms is found by a court of
              applicable jurisdiction to be invalid, the parties nevertheless
              agree that the court shall endeavour to give effect to the
              parties' intentions as reflected in the provision and the other
              provision of the Terms shall remain in full force and effect.
            </p>

            <p className="text-gray-700 leading-relaxed">
              You agree to indemnify, defend and hold aroundchess harmless from
              any and all claims, liabilities, expenses and damages, including
              reasonable attorneys' fees and costs, made by any third party
              related to your use or attempted use of the services in violation
              of these Terms, your violation of any law or the rights of any
              third party, or user content, including without limitation any
              claim of infringement or misappropriation of intellectual property
              or any proprietary rights.
            </p>

            <p className="text-gray-700 leading-relaxed">
              No agency, partnership, joint venture, employee-employer or
              franchisor-franchise relationship is intended or created by these
              Terms between you and aroundchess. You as the customer may not
              assign this agreement. aroundchess may assign this agreement at
              any time to the successor in interest in connection with a merger,
              consolidation or other corporate reorganization.
            </p>

            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed by the laws of Switzerland without
              reference to its choice or conflict of law principles. You agree
              that all such claims and disputes will be heard and resolved
              exclusively in state courts located in Switzerland. You hereby
              consent to the personal jurisdiction to those courts over you for
              this purpose, and you waive and agree not to assert any objection
              to such proceedings in those courts.
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
                href="mailto:contact@aroundchess.com"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                contact@aroundchess.com
              </a>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
