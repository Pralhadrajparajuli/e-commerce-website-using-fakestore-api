import { Link } from "react-router-dom";

const PromoGrid = ({ products }) => {
  return (
    <section className="mx-auto max-w-7xl px-6 py-8">
      <div className="grid grid-cols-12 gap-5">

        {/* LEFT - Smaller */}
        <div className="col-span-3 h-[600px] overflow-hidden rounded-2xl bg-gray-100 p-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Featured
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Discover our latest products
          </p>

          <Link to="/products">
            <img
              src={products[0]?.image}
              alt={products[0]?.title}
              className="mt-8 h-[450px] w-full cursor-pointer object-contain transition-transform duration-300 hover:scale-105"
            />
          </Link>
        </div>


        {/* MIDDLE */}
        <div className="col-span-4 grid h-[600px] grid-rows-2 gap-5">

          {/* Middle Top */}
          <div className="overflow-hidden rounded-2xl bg-blue-50 p-5">
            <h2 className="text-xl font-bold text-gray-900">
              New Arrivals
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              Fresh products for you
            </p>

            <Link to="/products">
              <img
                src={products[1]?.image}
                alt={products[1]?.title}
                className="mt-4 h-[190px] w-full cursor-pointer object-contain transition-transform duration-300 hover:scale-105"
              />
            </Link>
          </div>


          {/* Middle Bottom */}
          <div className="overflow-hidden rounded-2xl bg-purple-50 p-5">
            <h2 className="text-xl font-bold text-gray-900">
              Popular Picks
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              Customer favorite products
            </p>

            <Link to="/products">
              <img
                src={products[2]?.image}
                alt={products[2]?.title}
                className="mt-4 h-[190px] w-full cursor-pointer object-contain transition-transform duration-300 hover:scale-105"
              />
            </Link>
          </div>

        </div>


        {/* RIGHT - Wider */}
        <div className="col-span-5 h-[600px] overflow-hidden rounded-2xl bg-orange-50 p-6">
          <h2 className="text-3xl font-bold text-gray-900">
            Special Collection
          </h2>

          <p className="mt-2 text-gray-600">
            Explore our hand-picked collection
          </p>

          <Link to="/products">
            <img
              src={products[3]?.image}
              alt={products[3]?.title}
              className="mt-6 h-[430px] w-full cursor-pointer object-contain transition-transform duration-300 hover:scale-105"
            />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default PromoGrid;