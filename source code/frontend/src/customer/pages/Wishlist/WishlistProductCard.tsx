import { teal } from "@mui/material/colors";
import type { Product } from "../../../types/productTypes";
import { useAppDispatch } from "../../../Redux Toolkit/Store";
import CloseIcon from "@mui/icons-material/Close";
import { addProductToWishlist } from "../../../Redux Toolkit/Customer/WishlistSlice";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { MouseEvent } from 'react';

interface ProductCardProps {
  item: Product;
}

const WishlistProductCard: React.FC<ProductCardProps> = ({ item }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleIconClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (item._id) dispatch(addProductToWishlist({ productId: item._id }));
  };

  const handleCardClick = () => {
    navigate(
      `/product-details/${item.category?.categoryId ?? "unknown"}/${item.title}/${item._id}`
    );
  };

  return (
    <div
      onClick={handleCardClick}
      className="w-60 relative cursor-pointer hover:shadow-lg transition-shadow duration-200"
    >
      <div className="w-full">
        <img
          className=" object-top w-full"
          src={item.images[0]}
          alt={`product-${item.title}`}
        />
      </div>
      <div className="pt-3 space-y-1  rounded-md ">
        <div className=" space-y ">
          <p className="">{item.title}</p>
        </div>
        <div className=" flex items-center gap-3 ">
          <span className="font-semibold text-gray-800">
            {" "}
            ₹{item.sellingPrice}
          </span>
          <span className="text thin-line-through text-gray-400 ">
            ₹{item.mrpPrice}
          </span>
          <span className="text-[#00927c] font-semibold">
            {item.discountPercent}% off
          </span>
        </div>
      </div>

      <div className="absolute top-1 right-1">
        <Button type="button" onClick={handleIconClick}>
          <CloseIcon
            className="cursor-pointer bg-white rounded-full p-1"
            sx={{ color: teal[500], fontSize: "2rem" }}
          />
        </Button>
      </div>
    </div>
  );
};

export default WishlistProductCard;
