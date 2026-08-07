-- DropForeignKey
ALTER TABLE "_GiftToWishlist" DROP CONSTRAINT "_GiftToWishlist_A_fkey";

-- DropForeignKey
ALTER TABLE "_GiftToWishlist" DROP CONSTRAINT "_GiftToWishlist_B_fkey";

-- DropTable
DROP TABLE "_GiftToWishlist";
