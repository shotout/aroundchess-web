"use client";

export default function EUCompliance() {
  return (
    <div className="flex-1 flex-col p-4 lg:py-12 lg:px-8 min-h-screen">
      <div className="w-full mx-auto bg-white rounded-lg p-4">
        <header className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            COMPLIANCE WITH THE DIGITAL SERVICES ACT (DSA)
          </h1>
        </header>

        <section className="mb-10">
          <p className="text-gray-700 leading-relaxed mb-6">
            In compliance with Regulation (EU) 2022/2065 of the European
            Parliament and of the Council of 19 October 2022, known as the
            Digital Services Act (DSA), aroundchess AG hereby transparently
            discloses the following information:
          </p>

          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Average Monthly Active Recipients
              </h4>
              <p className="text-gray-700 leading-relaxed">
                Aroundchess maintains approximately 1,000 average monthly active
                recipients within the EU. This number is an average calculated
                based on the preceding 6-month period. This figure is updated on
                a regular basis (quarterly/semi-annually).
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Content Moderation and Reporting
              </h4>
              <p className="text-gray-700 leading-relaxed">
                aroundchess has clear procedures to report inappropriate or
                illegal content. Users can report issues directly via email at{" "}
                <a
                  href="mailto:contact@aroundchess.com"
                  className="text-blue-600 hover:text-blue-800 underline font-medium"
                >
                  contact@aroundchess.com
                </a>
                . Our content moderation team diligently addresses these
                reports, ensuring a safe and compliant user environment.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Transparency and Reporting Obligations
              </h4>
              <p className="text-gray-700 leading-relaxed">
                aroundchess will update this disclosure regularly and
                transparently, reflecting any significant changes to the active
                user base or relevant compliance practices.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Contact for DSA-related Inquiries
              </h4>
              <p className="text-gray-700 leading-relaxed">
                For further questions or requests regarding compliance with the
                Digital Services Act, please contact our compliance team
                directly at{" "}
                <a
                  href="mailto:contact@aroundchess.com"
                  className="text-blue-600 hover:text-blue-800 underline font-medium"
                >
                  contact@aroundchess.com
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
            OUR CONTACT DETAILS
          </h3>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-gray-700 leading-relaxed mb-4">
              For any compliance-related inquiries or questions regarding our EU
              compliance measures, please contact us at{" "}
              <a
                href="mailto:contact@aroundchess.com"
                className="text-blue-600 hover:text-blue-800 underline font-medium"
              >
                contact@aroundchess.com
              </a>{" "}
              or you can write to us at:
            </p>
            <address className="text-gray-700 not-italic">
              aroundchess AG, Neugasse 6, 6300 Zug, Switzerland
            </address>
          </div>
        </section>

        <footer className="border-t border-gray-200 pt-6">
          <p className="text-[14px] --sm text-gray-600 text-center">
            Last updated: 05 June 2025
          </p>
        </footer>
      </div>
    </div>
  );
}
