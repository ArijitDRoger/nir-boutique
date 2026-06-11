import { useState } from "react";

export default function HelpSupport() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    const text = `*New Support Request - Nir Boutique*

    Name: ${form.name}

    Email: ${form.email}

    Mobile: ${form.mobile}

    Message:
    ${form.message}`;

    const whatsappUrl = `https://wa.me/917001688122?text=${encodeURIComponent(text)}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-purple-50">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side */}
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-purple-900 leading-tight">
              Do you have any question?
            </h1>

            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              Have a question or comment? Use the contact form to send us a
              message and our team will get back to you as soon as possible.
            </p>
          </div>

          {/* Right Side Form */}
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-purple-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">E-mail</label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-purple-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Mobile Number
                </label>

                <input
                  type="tel"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  className="w-full border border-purple-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Message
                </label>

                <textarea
                  rows="5"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  className="w-full border border-purple-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
