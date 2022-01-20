import {
  LOAD_PRODUCTS,
  SET_LISTVIEW,
  SET_GRIDVIEW,
  UPDATE_SORT,
  SORT_PRODUCTS,
  UPDATE_FILTERS,
  FILTER_PRODUCTS,
  CLEAR_FILTERS,
} from "../actions";

const filter_reducer = (state, action) => {
  switch (action.type) {
    case LOAD_PRODUCTS:
      let maxPrice = action.payload.map((p) => p.price);
      // let minPrice = Math.min(...maxPrice);
      maxPrice = Math.max(...maxPrice);

      return {
        ...state,
        all_products: [...action.payload],
        filtered_products: [...action.payload],
        filters: {
          ...state.filters,
          max_price: maxPrice,
          price: maxPrice,
        },
      };
    case SET_GRIDVIEW:
      return { ...state, grid_view: true };
    case SET_LISTVIEW:
      return { ...state, grid_view: false };
    case UPDATE_SORT:
      return { ...state, sort: action.payload };
    case SORT_PRODUCTS:
      const { sort, filtered_products } = state;
      let tempProducts = [...filtered_products];
      if (sort === "price-lowest") {
        tempProducts = tempProducts.sort((a, b) => a.price - b.price);
      }
      if (sort === "price-heighest") {
        tempProducts = tempProducts.sort((a, b) => b.price - a.price);
      }
      if (sort === "name-a") {
        tempProducts = tempProducts.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
      }
      if (sort === "name-z") {
        tempProducts = tempProducts.sort((a, b) =>
          b.name.localeCompare(a.name)
        );
      }
      return { ...state, filtered_products: tempProducts };
    case UPDATE_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case FILTER_PRODUCTS:
      const { all_products } = state;
      let tempFilter = [...all_products];
      const { price, shipping, text, company, category, color } = state.filters;
      if (text) {
        tempFilter = tempFilter.filter((item) => {
          return item.name.toLowerCase().startsWith(text);
        });
      }
      if (category !== "all") {
        tempFilter = tempFilter.filter((item) => item.category === category);
      }
      if (company !== "all") {
        tempFilter = tempFilter.filter((item) => item.company === company);
      }
      if (color !== "all") {
        tempFilter = tempFilter.filter((item) => {
          return item.colors.includes(color);
        });
      }
      tempFilter = tempFilter.filter((item) => item.price <= price);
      if (shipping) {
        tempFilter = tempFilter.filter((item) => item.shipping === true);
      }
      return { ...state, filtered_products: tempFilter };
    case CLEAR_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          text: "",
          company: "all",
          category: "all",
          color: "all",
          price: state.filters.max_price,
          shipping: false,
        },
      };
  }

  throw new Error(`No Matching "${action.type}" - action type`);
};

export default filter_reducer;
