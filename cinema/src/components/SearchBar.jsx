import React from "react";
import "../css/SearchBar.css";

const SearchBar = ({ searchQuery, setSearchQuery }) => {
	return (
		<div className="search-bar">
			<input
				type="text"
				placeholder="Пошук фільмів..."
				value={searchQuery}
				onChange={e => setSearchQuery(e.target.value)}
			/>
		</div>
	);
};

export default SearchBar;
