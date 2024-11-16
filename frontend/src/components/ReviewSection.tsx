import { FC } from "react";
import DividerWithTitle from "./common/DividerWithTitle";
import { User } from "@nextui-org/react";
import { FaStar } from "react-icons/fa6";
import RichEditor from "./rich-editor";
import { Link } from "react-router-dom";

export interface Review {
  content: string;
  date: string;
  id: string;
  rating: number;
  user: {
    id: string;
    name: string;
    avatar?: {
      url: string;
    };
  };
}

interface Props {
  title?: string;
  id?: string;
  reviews: Review[];
}

const ReviewSection: FC<Props> = ({ id, title, reviews }) => {
  if (!reviews.length)
    return (
      <div className="pb-20">
        <DividerWithTitle title={title} />

        <div className="mt-6">
          <p className="text-xl">
            Be the first to{" "}
            <Link to={`/rate/${id}`} className="underline font-semibold">
              add a review
            </Link>
          </p>
        </div>
      </div>
    );

  return (
    <div className="pb-20">
      <DividerWithTitle title={title} />
      <div className="mt-6 space-y-6">
        {reviews.map((review) => {
          return (
            <div key={review.id}>
              <User
                name={review.user.name}
                avatarProps={{
                  src: review.user.avatar?.url,
                }}
                description={
                  <div className="flex items-center space-x-1">
                    <span>{review.rating}</span>
                    <FaStar />
                  </div>
                }
              />
              <div className="pl-10">
                <RichEditor value={review.content} className="regular" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewSection;
