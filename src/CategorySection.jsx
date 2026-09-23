import { Link } from "react-router-dom";

const CategorySection = ({ products }) => {
  // Get unique categories
  const categories = [...new Set(products.map((product) => product.category))];

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">

      {/* Title */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          Shop by Category
        </h2>

        <p className="mt-2 text-gray-500">
          Explore our products by category
        </p>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-4 gap-5">

        {categories.map((category) => {

          // Find a product from this category
          const product = products.find(
            (item) => item.category === category
          );

          return (
            <Link
              key={category}
              to={`/category/${category}`}
              className="group"
            >

              {/* Image box */}
              <div className="h-64 overflow-hidden rounded-2xl bg-gray-100 p-5">
                <img
                  src={product?.image}
                  alt={category}
                  className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                />
              </div>

              {/* Category title */}
              <h3 className="mt-4 text-lg font-semi capitalize text-gray-900 group-hover:text-blue-600">
                {category}
              </h3>

            </Link>
          );
        })}

      </div>
    </section>
  );
};

export default CategorySection;