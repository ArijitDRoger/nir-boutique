import Navbar from "../components/Navbar";

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-purple-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 pt-28 pb-16">
        <div className="bg-white rounded-3xl shadow-sm border border-purple-100 p-8 md:p-10">
          <h1 className="text-4xl font-bold text-purple-800 mb-6">
            Terms & Conditions
          </h1>

          <p className="text-gray-600 mb-6">Last Updated: June 2026</p>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-purple-700 mb-2">
                1. Introduction
              </h2>
              <p>
                Welcome to Nir Boutique. By accessing or using our website, you
                agree to comply with and be bound by these Terms & Conditions.
                Please read them carefully before placing an order.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-purple-700 mb-2">
                2. Products & Availability
              </h2>
              <p>
                We strive to ensure that all product descriptions, images,
                pricing, and availability information are accurate. However,
                minor variations in color, fabric texture, and design may occur
                due to photography, screen settings, or manufacturing processes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-purple-700 mb-2">
                3. Pricing
              </h2>
              <p>
                All prices displayed on the website are in Indian Rupees (₹).
                Nir Boutique reserves the right to modify prices at any time
                without prior notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-purple-700 mb-2">
                4. Orders
              </h2>
              <p>
                Orders are subject to acceptance and availability. We reserve
                the right to cancel or refuse any order due to stock
                limitations, pricing errors, or suspected fraudulent activity.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-purple-700 mb-2">
                5. Returns & Exchanges
              </h2>
              <p>
                Return and exchange requests must be initiated within the
                specified return window. Products must be unused, unwashed, and
                returned with original tags and packaging.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-purple-700 mb-2">
                6. User Responsibilities
              </h2>
              <p>
                Nir Boutique currently operates on a store pickup basis. After
                placing an order, customers will be notified when their order is
                ready for collection. Customers are responsible for collecting
                their orders from the store within a reasonable period and must
                provide accurate contact information to receive order updates.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-purple-700 mb-2">
                7. Intellectual Property
              </h2>
              <p>
                All website content, including logos, designs, images, product
                descriptions, and branding, is the property of Nir Boutique and
                may not be copied, reproduced, or distributed without written
                permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-purple-700 mb-2">
                8. Limitation of Liability
              </h2>
              <p>
                Nir Boutique shall not be liable for any indirect, incidental,
                or consequential damages arising from the use of our website or
                products.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-purple-700 mb-2">
                9. Contact Us
              </h2>
              <p>
                For questions regarding these Terms & Conditions, please contact
                us through our Help & Support page or WhatsApp support.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
