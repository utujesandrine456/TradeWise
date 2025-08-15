import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from './assets/logo.png';
import styles from './Home.module.css'



export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [company, setCompany] = useState({ name: "", category: "", phone: "" });
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", buying: "", selling: "" });
  const [agreed, setAgreed] = useState(false);

  const addProduct = () => {
    if (!newProduct.name || !newProduct.buying || !newProduct.selling) return;
    setProducts([...products, newProduct]);
    setNewProduct({ name: "", buying: "", selling: "" });
  };

  const deleteProduct = (index) => setProducts(products.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    if (!agreed) return alert("You must agree to terms.");
   
    await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company, products }),
    });
    navigate("/dashboard"); 
  };

  return (
  <>

    {/* Navbar */}
    <div className="bg-[#BE741E] flex justify-between items-center px-6">
      <div className="flex items-center space-x-1">
        <img src={logo} alt="logo" className={styles.home_navbar_logo} />
        <h1 className={styles.home_navbar_title}>TradeWise</h1>
      </div>
      <div className={styles.home_navbar_links}>
          <a href="#company">Company info</a>
          <a href="#product">Products</a>
          <a href="#terms">Terms & Conditions</a>
      </div>

    </div>

    <div className="min-h-auto flex justify-center bg-gray-100 p-2">
      <div className="bg-gray-100 shadow-lg rounded-xl p-8 w-full max-w-3xl my-6">
        {/* Progress */}
        <div className="flex justify-between mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 mx-1 rounded ${step >= s ? "bg-[#BE741E]" : "bg-gray-300"}`}
            ></div>
          ))}
        </div>

        {/* Step 1: Company */}
        {step === 1 && (
          <div >
            <h1 className="text-2xl font-bold mb-4">Your Company Info</h1>
            <input
              type="text"
              placeholder="Company Name"
              value={company.name}
              onChange={(e) => setCompany({ ...company, name: e.target.value })}
              className="w-full p-3 border rounded mb-4"
            />
            <input
              type="text"
              placeholder="Category"
              value={company.category}
              onChange={(e) => setCompany({ ...company, category: e.target.value })}
              className="w-full p-3 border rounded mb-4"
            />
            <input
              type="text"
              placeholder="Business Email"
              value={company.category}
              onChange={(e) => setCompany({ ...company, category: e.target.value })}
              className="w-full p-3 border rounded mb-4"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={company.phone}
              onChange={(e) => setCompany({ ...company, phone: e.target.value })}
              className="w-full p-3 border rounded mb-4"
            />
            <textarea placeholder="Company short description..." className="w-full border rounded-lg p-2 my-1"></textarea>
            <button
              onClick={() => setStep(2)}
              className="bg-[#BE741E] text-white px-6 py-2 rounded w-full"
            >
              Next
            </button>
          </div>
        )}


        {/* Step 2: Products */}
        {step === 2 && (
          <div className="bg-gray-100 justify-center items-center p-6">
            <h1 className="text-2xl font-bold mb-4">Products</h1>
            
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="p-3 border rounded "
              />
              <input
                type="number"
                placeholder="Buying Price"
                value={newProduct.buying}
                onChange={(e) => setNewProduct({ ...newProduct, buying: e.target.value })}
                className="p-3 border rounded "
              />
              <input
                type="number"
                placeholder="Selling Price"
                value={newProduct.selling}
                onChange={(e) => setNewProduct({ ...newProduct, selling: e.target.value })}
                className="p-3 border rounded "
              />
              
              <button onClick={addProduct} className="bg-green-500 text-white rounded px-4 relative top-[-60px] right-20 font-semibold">
                Add+
              </button>
            </div>

            <table className="w-full border-collapse border mb-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2">Name</th>
                  <th className="p-2">Buying Price</th>
                  <th className="p-2">Selling Price</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">{p.name}</td>
                    <td className="p-2">{p.buying}</td>
                    <td className="p-2">{p.selling}</td>
                    <td className="p-2">
                      <button
                        onClick={() => deleteProduct(i)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="px-6 py-2 border rounded">
                Back
              </button>
              <button onClick={() => setStep(3)} className="bg-[#BE741E] text-white px-6 py-2 rounded">
                Next
              </button>
            </div>
          </div>
        )}


        {/* Step 3: Terms */}
        {step === 3 && (
          <>
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 max-w-3xl mx-auto max-h-[500px] overflow-y-auto hide-scrollbar">
              <h2 className="text-3xl font-extrabold mb-6 text-[#BE741E] tracking-tight">
                TradeWise - Terms & Conditions
              </h2>

              <ol className="list-decimal pl-6 text-gray-700 space-y-4 leading-relaxed">
                <li>
                  <strong className="text-gray-900">Acceptance of Terms: <br></br></strong>  
                  By creating an account and using TradeWise, you agree to abide by these Terms & Conditions.
                </li>

                <li>
                  <strong className="text-gray-900">Account Responsibility: <br></br></strong>  
                  You are responsible for maintaining the confidentiality of your login credentials and activities under your account.
                </li>

                <li>
                  <strong className="text-gray-900">Data Accuracy: <br></br></strong>  
                  All company and product information you provide must be accurate and up to date.
                </li>

                <li>
                  <strong className="text-gray-900">Usage of Platform: <br></br></strong>  
                  TradeWise is intended for legitimate business tracking and trade management only.
                </li>

                <li>
                  <strong className="text-gray-900">Prohibited Activities: <br></br></strong>  
                  You must not engage in fraudulent, illegal, or misleading activities using this platform.
                </li>

                <li>
                  <strong className="text-gray-900">Data Storage & Security: <br></br></strong>  
                  Your data is stored securely. However, we are not liable for data loss due to unforeseen events.
                </li>

                <li>
                  <strong className="text-gray-900">Termination: <br></br></strong>  
                  We reserve the right to suspend or terminate your account if you violate these Terms.
                </li>

                <li>
                  <strong className="text-gray-900">Updates to Terms: <br></br></strong>  
                  TradeWise may update these Terms from time to time. Continued use means you accept the updated Terms.
                </li>
              </ol>

              <div className="mt-8 flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={() => setAgreed(!agreed)}
                  className="w-5 h-5 accent-[#BE741E] border-gray-300 rounded"  />
                <span className="text-gray-800 text-sm md:text-base">
                  I agree to the Terms & Conditions
                </span>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition duration-200"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className={`px-8 py-2 rounded-lg font-semibold text-white transition duration-200 ${
                    agreed
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-green-300 cursor-not-allowed"
                  }`}
                  disabled={!agreed}
                >
                  Submit
                </button>
              </div>
            </div>

          </>
        )}
      </div>
    </div>
  </>
  );
}


