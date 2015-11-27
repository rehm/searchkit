import * as React from "react";
import SearchBox from "../../search/search-box/src/SearchBox.tsx";
import Hits from "../../search/hits/src/Hits.tsx";
import RefinementListFilter from "../../search/filters/refinement-list-filter/src/RefinementListFilter.tsx";
import MenuFilter from "../../search/filters/menu-filter/src/MenuFilter.tsx";
import HitsStats from "../../search/hits-stats/src/HitsStats.tsx";
import ESClient from "../../../domain/ESClient.ts";
import ResetFilters from "../../search/filters/reset-filters/src/ResetFilters.tsx";
import Pagination from "../../search/pagination/src/Pagination.tsx";
import * as Rx from "rx"
require("./../styles/index.scss");

export default class App extends React.Component<any, any> {

	private searcher: ESClient;
	results:any
	searcherUnsubscribe:Rx.IDisposable

	constructor(props) {
		super(props);
		console.log(props)
		this.searcher = props.searcher
	}
	componentWillMount(){
		this.searcherUnsubscribe = this.searcher.resultsListener.subscribe(
			()=> this.forceUpdate()
		)
	}
	componentDidMount(){
		console.log("mounted")
		this.searcher.completeRegistration()
	}

	componentWillUnmount(){
		this.searcherUnsubscribe.dispose()
	}

	render() {
		return (
			<div className="layout">
				<div className="layout__search-box">
					<SearchBox searcher={this.searcher}/>
				</div>

				<div className="layout__filters">
					<ResetFilters searcher={this.searcher}/>
					<div className="layout__filters__heading">Refine Results By</div>
					<RefinementListFilter title="Genres" searcher={this.searcher} field="genres.raw" operator="OR"/>
					<RefinementListFilter title="Actors" searcher={this.searcher} field="actors.raw" operator="OR"/>
				</div>

				<div className="layout__results-info">
					<HitsStats searcher={this.searcher}/>
				</div>

				<div className="layout__results">
					<Hits searcher={this.searcher} hitsPerPage={50}/>
					<Pagination searcher={this.searcher}/>
				</div>

			</div>
		);
	}
}
