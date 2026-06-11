import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { useAuth } from "../services/AuthContext";
import { db } from "../firebase";
import toast from "react-hot-toast";
import "../App.css";

export default function FeedbackSection() {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const navigate = useNavigate();
  const trackRef = useRef(null);
  const { user } = useAuth();
  const [userName, setUserName] = useState("");

  const [reviewForm, setReviewForm] = useState({
    name: "",
    rating: 5,
    review: "",
  });

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function loadUser() {
      if (!user) {
        setUserName("");
        return;
      }

      try {
        const snap = await getDoc(doc(db, "users", user.uid));

        if (snap.exists()) {
          setUserName(snap.data().name);
        }
      } catch (err) {
        console.log(err);
      }
    }

    loadUser();
  }, [user]);

  useEffect(() => {
    if (!user) {
      setReviews([]);
      return;
    }

    const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setReviews(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })),
        );
      },
      (err) => {
        console.log("Reviews listener closed:", err);
      },
    );

    return () => unsubscribe();
  }, [user]);

  async function submitReview() {
    if (!user) {
      toast.error("Please login first");
      return;
    }

    if (!userName) {
      toast.error("Unable to load your profile");
      return;
    }

    if (!reviewForm.review.trim()) {
      toast.error("Please write a review");
      return;
    }

    const existing = reviews.find((r) => r.userId === user.uid);

    if (existing) {
      toast.error("You have already submitted a review");
      return;
    }

    await addDoc(collection(db, "reviews"), {
      name: userName,
      rating: reviewForm.rating,
      review: reviewForm.review,
      userId: user.uid,
      createdAt: serverTimestamp(),
    });

    setReviewForm({
      name: "",
      rating: 5,
      review: "",
    });

    toast.success("Review submitted successfully!");

    setShowReviewModal(false);
  }

  function scrollLeft() {
    trackRef.current?.scrollBy({
      left: -400,
      behavior: "smooth",
    });
  }

  function scrollRight() {
    trackRef.current?.scrollBy({
      left: 400,
      behavior: "smooth",
    });
  }

  return (
    <>
      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md">
            <h3 className="text-2xl font-bold text-purple-700 mb-4">
              Leave a Review
            </h3>

            <div className="mb-3">
              <label className="text-sm font-medium text-gray-600">
                Reviewing As
              </label>

              <div className="border rounded-xl p-3 bg-gray-50 font-semibold">
                {userName}
              </div>
            </div>

            <select
              value={reviewForm.rating}
              onChange={(e) =>
                setReviewForm({
                  ...reviewForm,
                  rating: Number(e.target.value),
                })
              }
              className="w-full border rounded-xl p-3 mb-3"
            >
              <option value={5}>★★★★★ (5)</option>
              <option value={4}>★★★★ (4)</option>
              <option value={3}>★★★ (3)</option>
              <option value={2}>★★ (2)</option>
              <option value={1}>★ (1)</option>
            </select>

            <textarea
              rows="4"
              placeholder="Write your review..."
              value={reviewForm.review}
              onChange={(e) =>
                setReviewForm({
                  ...reviewForm,
                  review: e.target.value,
                })
              }
              className="w-full border rounded-xl p-3 mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="flex-1 border border-gray-300 rounded-xl py-3"
              >
                Cancel
              </button>

              <button
                onClick={submitReview}
                className="flex-1 bg-purple-600 text-white rounded-xl py-3"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Section */}
      <section className="py-16 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-purple-600 font-semibold uppercase tracking-wider">
              Customer Love
            </p>

            <h2 className="text-4xl font-bold text-purple-900 mt-2">
              Feedback by Our Lovely Customers
            </h2>

            <div className="flex flex-wrap justify-center gap-3 mt-5">
              <button
                onClick={() => setShowReviewModal(true)}
                className="bg-purple-600 text-white px-6 py-3 rounded-full"
              >
                Give Review
              </button>

              <button
                onClick={() => navigate("/reviews")}
                className="border border-purple-600 text-purple-600 px-6 py-3 rounded-full"
              >
                View All Reviews
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2 mb-4">
            <button
              onClick={scrollLeft}
              className="w-10 h-10 rounded-full bg-white shadow border"
            >
              ←
            </button>

            <button
              onClick={scrollRight}
              className="w-10 h-10 rounded-full bg-white shadow border"
            >
              →
            </button>
          </div>

          <div className="overflow-hidden py-8">
            <div
              ref={trackRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide py-4"
            >
              {reviews.map((review) => (
                <div key={review.id} className="review-card shrink-0">
                  <div className="text-yellow-500 text-lg mb-2">
                    {"★".repeat(review.rating)}
                  </div>

                  <h3 className="font-bold text-lg text-purple-700 mb-2">
                    {review.name}
                  </h3>

                  <p className="text-gray-600 text-sm">{review.review}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
