import { FC, useState } from "react";
import useCart from "../hooks/useCart";
import Skeletons from "../components/skeletons";
import { Button, Chip, Divider } from "@nextui-org/react";
import { calculateDiscount, formatPrice, parseError } from "../utils/helper";
import { FaMinus, FaPlus, FaRegTrashCan } from "react-icons/fa6";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import client from "../api/client";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface Props {}

const Cart: FC<Props> = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const {
    id,
    pending,
    items,
    totalCount,
    fetching,
    subTotal,
    totalPrice,
    updateCart,
    clearCart,
  } = useCart();

  const handleCheckout = async () => {
    try {
      if (!profile) return navigate("/sign-up");
      setBusy(true);
      const { data } = await client.post("/checkout", { cartId: id });
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (error) {
      parseError(error);
    } finally {
      setBusy(false);
    }
  };

  if (fetching) return <Skeletons.Cart />;

  if (!totalCount)
    return (
      <div className="lg:p-0 p-5">
        <h1 className="text-xl mb-6 font-semibold">Your Shopping Cart</h1>
        <div className="p-5 text-center">
          <h1 className="font-semibold text-3xl opacity-40">
            This Cart is Empty!
          </h1>
        </div>
      </div>
    );

  return (
    <div className="lg:p-0 p-5">
      <div className="flex justify-between items-center">
        <h1 className="text-xl mb-6 font-semibold">Your Shopping Cart</h1>
        <button onClick={clearCart} className="underline">
          Clear Cart
        </button>
      </div>
      <div className="space-y-6">
        {items.map(({ product, quantity }) => {
          return (
            <div key={product.id} className="flex">
              {/* Product Image */}

              <img
                src={product.cover}
                alt={product.title}
                className="w-28 h-[185px] object-cover rounded"
              />

              {/* Product Details */}
              <div className="md:grid flex flex-col grid-cols-6">
                <div className="p-5 col-span-5">
                  <h1>{product.title}</h1>

                  <div className="flex space-x-2">
                    <Chip color="danger">
                      {calculateDiscount(product.price)}% Off
                    </Chip>
                    <h1 className="line-through italic">
                      {formatPrice(Number(product.price.mrp))}
                    </h1>
                  </div>

                  <div className="flex space-x-2">
                    <h1 className="font-bold">
                      {formatPrice(Number(product.price.sale))}
                    </h1>

                    <span>x {quantity}</span>
                  </div>
                </div>

                {/* Cart Control */}
                <div className="col-span-1 flex items-center space-x-3 p-5 md:p-0">
                  <Button
                    isIconOnly
                    variant="solid"
                    size="sm"
                    isLoading={pending || busy}
                    onClick={() => updateCart({ product, quantity: -1 })}
                  >
                    <FaMinus />
                  </Button>
                  <Chip radius="sm" variant="bordered">
                    {quantity}
                  </Chip>
                  <Button
                    isIconOnly
                    variant="solid"
                    size="sm"
                    isLoading={pending || busy}
                    onClick={() => updateCart({ product, quantity: 1 })}
                  >
                    <FaPlus />
                  </Button>
                  <Button
                    isIconOnly
                    variant="solid"
                    size="sm"
                    isLoading={pending || busy}
                    onClick={() => updateCart({ product, quantity: -quantity })}
                  >
                    <FaRegTrashCan />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Divider className="my-6" />

      <div className="md:block flex justify-between items-end">
        <div className="text-right space-y-1">
          <h1 className="font-semibold text-xl">Cart Total</h1>
          <Divider />
          <p className="line-through italic">{formatPrice(subTotal)}</p>
          <p className="font-semibold text-xl">{formatPrice(totalPrice)}</p>
        </div>

        <div className="text-right md:mt-3">
          <Button
            color="danger"
            radius="sm"
            size="lg"
            isLoading={pending || busy}
            startContent={<MdOutlineShoppingCartCheckout size={18} />}
            onClick={handleCheckout}
          >
            Checkout
          </Button>
          <div className="mt-3">
            <Chip size="sm">
              <p>
                You are saving total{" "}
                {calculateDiscount({
                  mrp: subTotal.toFixed(2),
                  sale: totalPrice.toFixed(2),
                })}
                %
              </p>
            </Chip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
