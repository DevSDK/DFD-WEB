import React, { Component } from 'react';
import '../../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import LOLGameElement from './GameListElement'
import { IGame } from '../../utils/GameDataUtils'
import { AutoSizer, List as VirtualizedList, CellMeasurer, CellMeasurerCache, ListRowProps } from 'react-virtualized';

import { List } from 'immutable'

interface IProps {
    gamelist: List<IGame>
}

class LOLGameList extends Component<IProps> {
    _cache: CellMeasurerCache = new CellMeasurerCache({
        fixedWidth: true,
        minHeight: 120

    })
    list: React.RefObject<VirtualizedList>

    constructor(props: IProps) {
        super(props)
        this.listRenderer = this.listRenderer.bind(this)
        this.resized = this.resized.bind(this)
        this.list = React.createRef()
        this.render = this.render.bind(this)
    }
    listRenderer({ index, key, style, parent }: ListRowProps) {
        const v = this.props.gamelist.get(index)
        if (!v) {
            return <div></div>
        }
        return <CellMeasurer
            cache={this._cache}
            columnIndex={0}
            key={key}
            parent={parent}
            rowIndex={index}>
            <div key={key} style={style}>
                <LOLGameElement
                    queueid={v.queueid} gameid={v.gameid} win={v.win} timestamp={v.timestamp} members={v.participants}></LOLGameElement>
            </div>

        </CellMeasurer>

    }
    resized() {
        if (this.list.current != null) {
            this.list.current.recomputeRowHeights()

            this._cache.clearAll()
        }
    }
    render() {
        if (this.props.gamelist === null || this.props.gamelist === undefined)
            return <div></div>

        return (
            <AutoSizer style={{ height: "400px", width: "100%" }} onResize={this.resized}>
                {({ height, width }) =>
                    <VirtualizedList ref={this.list}
                        width={width}
                        containerStyle={{
                            width: "100%",
                            maxWidth: "100%"
                        }}
                        style={{
                            outline: 'none',
                            width: "100%",
                        }}
                        overscanRowsCount={1}
                        height={height}
                        rowCount={this.props.gamelist.size}
                        rowHeight={this._cache.rowHeight}
                        rowRenderer={this.listRenderer}
                        list={this.props.gamelist}
                        deferredMeasurementCache={this._cache}
                    />
                }


            </AutoSizer>
        );
    }
}

export default React.memo(LOLGameList);