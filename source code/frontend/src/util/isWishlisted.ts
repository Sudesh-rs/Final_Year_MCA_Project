import type { Product } from "../types/productTypes";
import type { Wishlist } from "../types/wishlistTypes";

export function isWishlisted(wishlist: Wishlist | null | undefined, product: Product) {
  return wishlist?.products?.some(
    (p) => p._id?.toString() === product._id?.toString()
  );
}
