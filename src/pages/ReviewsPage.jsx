import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "../components/Navbar";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReviews(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      );
    });

    return unsubscribe;
  }, []);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-purple-50 pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-purple-600 font-semibold uppercase">
              Customer Love
            </p>

            <h1 className="text-4xl font-bold text-purple-900 mt-2">
              All Customer Reviews
            </h1>

            <p className="text-gray-600 mt-3">
              {reviews.length} Reviews from our lovely customers ❤️
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-3xl p-6 shadow-md border border-purple-100"
              >
                <div className="text-yellow-500 text-lg mb-2">
                  {"★".repeat(review.rating)}
                </div>

                <h3 className="font-bold text-lg text-purple-700">
                  {review.name}
                </h3>

                <p className="text-gray-600 mt-3 leading-relaxed">
                  {review.review}
                </p>
              </div>
            ))}
          </div>

          {reviews.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              No reviews yet.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
