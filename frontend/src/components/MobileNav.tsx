import { Badge, Button } from "@nextui-org/react";
import clsx from "clsx";
import { FC } from "react";
import { FaBookReader } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { Link } from "react-router-dom";
import DarkModeSwitch from "./common/DarkModeSwitch";

interface Props {
  visible: boolean;
  onClose(): void;
  onLogout(): void;
  cartTotal?: number | string;
  isAuthor?: boolean;
  isLoggedIn: boolean;
}

const MobileNav: FC<Props> = ({
  isAuthor = false,
  cartTotal,
  visible,
  isLoggedIn,
  onClose,
  onLogout,
}) => {
  return (
    <div>
      <div
        className={clsx(
          visible ? "left-0" : "-left-full",
          "transition-all fixed bottom-0 top-0 w-3/4 z-[100] bg-white dark:bg-black"
        )}
      >
        <div className="pt-10 px-5 space-y-3">
          <div className="flex justify-between items-center">
            <Link
              onClick={onClose}
              to="/"
              className="flex items-center justify-center space-x-2"
            >
              <FaBookReader size={24} />
              <p className="font-bold text-inherit">Store</p>
            </Link>

            <div className="flex space-x-2 items-center">
              <div className="px-4 py-2">
                <Link onClick={onClose} to="/cart">
                  <Badge content={cartTotal} color="danger" shape="circle">
                    <FaCartShopping size={24} />
                  </Badge>
                </Link>
              </div>
              <div className="px-4 py-2">
                <DarkModeSwitch />
              </div>
            </div>
          </div>

          <hr />

          {isLoggedIn && (
            <ul className="p-4 space-y-4">
              <li>
                <Link onClick={onClose} to="/profile">
                  Profile
                </Link>
              </li>
              <li>
                <Link onClick={onClose} to="/orders">
                  Orders
                </Link>
              </li>
              <li>
                <Link onClick={onClose} to="/library">
                  Library
                </Link>
              </li>
              {isAuthor && (
                <li>
                  <Link onClick={onClose} to="/create-new-book">
                    Create New Book
                  </Link>
                </li>
              )}
            </ul>
          )}

          {isLoggedIn && (
            <div>
              <Button onClick={onLogout} radius="sm" className="w-full">
                Logout
              </Button>
            </div>
          )}

          {!isLoggedIn && (
            <div>
              <Button
                onClick={onClose}
                className="w-full"
                as={Link}
                to="sign-up"
                variant="bordered"
              >
                Sign Up / In
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop */}
      <div
        onClick={onClose}
        className={clsx(
          visible ? "fixed" : "hidden",
          "inset-0 z-50 dark:bg-white dark:bg-opacity-50 bg-black bg-opacity-50 backdrop-blur"
        )}
      />
    </div>
  );
};

export default MobileNav;
