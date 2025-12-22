import React from "react";

const Kin = () => {
  return (
    <div>
      <fieldset className="personal border  border-gray-400 rounded-sm p-6">
        <legend className=" text-center text-2xl p-2">
          <strong>Residence Details</strong>
        </legend>
        <div className="wrapper  grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6 ">
          <div className="">
            <label
              htmlFor="county"
              className="block mb-2 text-sm font-medium  dark:text-white"
            >
              County
              <span className="text-red-500">
                {errors.county && errors.county.message}
              </span>
            </label>
            <input
              type="text"
              id="county"
              className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-300 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Vihiga"
              {...register("county")}
              name="county"
              required
            />
          </div>

          <div className="">
            <label
              htmlFor="subcounty"
              className="block mb-2 text-sm font-medium  dark:text-white"
            >
              Subcounty
              <span className="text-red-500">
                {errors.subcounty && errors.subcounty.message}
              </span>
            </label>
            <input
              type="text"
              id="subcounty"
              className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-300 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Sabatia"
              {...register("subcounty")}
              name="subcounty"
              required
            />
          </div>

          <div className="">
            <label
              htmlFor="location"
              className="block mb-2 text-sm font-medium  dark:text-white"
            >
              Location
              <span className="text-red-500">
                {errors.location && errors.location.message}
              </span>
            </label>
            <input
              type="text"
              id="location"
              className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-300 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Chamakanga"
              {...register("location")}
              name="location"
              required
            />
          </div>

          <div className="">
            <label
              htmlFor="sublocation"
              className="block mb-2 text-sm font-medium  dark:text-white"
            >
              Sub-location
              <span className="text-red-500">
                {errors.sublocation && errors.sublocation.message}
              </span>
            </label>
            <input
              type="text"
              id="sublocation"
              className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-300 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Wodanga"
              {...register("sublocation")}
              name="sublocation"
              required
            />
          </div>

          <div className="">
            <label
              htmlFor="Village"
              className="block mb-2 text-sm font-medium  dark:text-white"
            >
              Village
              <span className="text-red-500">
                {errors.village && errors.village.message}
              </span>
            </label>
            <input
              type="text"
              id="village"
              className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-300 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Mago"
              {...register("village")}
              name="village"
              required
            />
          </div>

          <div className="">
            <label
              htmlFor="city"
              className="block mb-2 text-sm font-medium  dark:text-white"
            >
              Home City
              <span className="text-red-500">
                {errors.city && errors.city.message}
              </span>
            </label>
            <input
              type="text"
              id="city"
              className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-300 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Chavakali"
              {...register("city")}
              name="city"
              required
            />
          </div>
          <div className="">
            <label
              htmlFor="code"
              className="block mb-2 text-sm font-medium  dark:text-white"
            >
              Postal Code
              <span className="text-red-500">
                {errors.code && errors.code.message}
              </span>
            </label>
            <input
              type="text"
              id="code"
              className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-300 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="97 -50302"
              {...register("code")}
              name="code"
              required
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="personal  border  border-gray-400 rounded-sm p-6">
        <legend className=" text-center text-2xl p-2">
          <strong>Next Of Kin Details</strong>
        </legend>
        <div className="wrapper  grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6 ">
          <div className="">
            <label
              htmlFor="kinfirstname"
              className="block mb-2 text-sm font-medium  dark:text-white"
            >
              First Name
              <span className="text-red-500">
                {errors.kinfirstname && errors.kinfirstname.message}
              </span>
            </label>
            <input
              type="text"
              id="kinfirstname"
              className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-300 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Messy"
              {...register("kinfirstname")}
              name="kinfirstname"
              required
            />
          </div>

          <div className="">
            <label
              htmlFor="kinlastname"
              className="block mb-2 text-sm font-medium  dark:text-white"
            >
              Last Name
              <span className="text-red-500">
                {errors.kinlastname && errors.kinlastname.message}
              </span>
            </label>
            <input
              type="text"
              id="kinlastname"
              className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-300 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Maina"
              {...register("kinlastname")}
              name="kinlastname"
              required
            />
          </div>

          <div className="">
            <label
              htmlFor="othernames"
              className="block mb-2 text-sm font-medium  dark:text-white"
            >
              Other names
              <span className="text-red-500">
                {errors.kinothernames && errors.kinothernames.message}
              </span>
            </label>
            <input
              type="text"
              id="kinothernames"
              className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-300 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="John"
              {...register("kinothernames")}
              name="kinothernames"
              required
            />
          </div>

          <div className="">
            <label
              htmlFor="relation"
              className="block mb-2 text-sm font-medium  dark:text-white"
            >
              Relation Type
              <span className="text-red-500">
                {errors.relation && errors.relation.message}
              </span>
            </label>
            <select
              id="relation"
              className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-300 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              {...register("relation")}
              name="relation"
              required
            >
              <option>---Relation Type---</option>
              <option value="father">Father</option>
              <option value="mother">Mother</option>
              <option value="sibling">Sibling</option>
              <option value="guardian">Guardian</option>
            </select>
          </div>

          <div className="">
            <label
              htmlFor="kinphone"
              className="block mb-2 text-sm font-medium  dark:text-white"
            >
              Phone
              <span className="text-red-500">
                {errors.kinphone && errors.kinphone.message}
              </span>
            </label>
            <input
              type="text"
              id="kinphone"
              className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-300 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="0712345678"
              {...register("kinphone")}
              name="kinphone"
            />
          </div>

          <div className="">
            <label
              htmlFor="altphone"
              className="block mb-2 text-sm font-medium  dark:text-white"
            >
              Alternative Phone
              <span className="text-red-500">
                {errors.altphone && errors.altphone.message}
              </span>
            </label>
            <input
              type="text"
              id="altphone"
              className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-300 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="0712345678"
              {...register("altphone")}
              name="altphone"
            />
          </div>
          <div className="">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium  dark:text-white"
            >
              Email
              <span className="text-red-500">
                {errors.email && errors.email.message}
              </span>
            </label>
            <input
              type="email"
              id="email"
              className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-300 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="email@gmail.com"
              {...register("email")}
              name="email"
              required
            />
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default Kin;
