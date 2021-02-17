import { toInteger } from "lodash"

export interface IGame {
    created: string,
    gameid: string,
    id: string,
    participants: string[],
    queueid: string,
    timestamp: string,
    win: boolean
}

export interface IHeatMapData {
    name: number,
    data: number[]
}

export interface ICountAndWin {
    win: number,
    count: number
}

export interface IChartData {
    name: string,
    data: any,
    color?: string
}

export type HeatMapPerYear = { [name: number]: IHeatMapData[] }

export type TotalMapWithQueueID = { [name: string]: ICountAndWin }

class GameDataUtils {
    static ConvertFromQueueID(id: string) {
        if (id === "430") {
            return "일반"
        }
        if (id === "450") {
            return "칼바람"
        }
        if (id === "440") {
            return "자유랭크"
        }
        if (id == "900") {
            return "U.R.F"
        }
        return id
    }

    static GetTotalMapWithQueueID(data: any): TotalMapWithQueueID {
        var GameCountsMap: TotalMapWithQueueID = {}
        for (var v of data) {
            if (GameCountsMap[v["queueid"]] == undefined) {
                GameCountsMap[v["queueid"]] = { win: 0, count: 0 }
            }
            GameCountsMap[v["queueid"]].win += v["win"]
            GameCountsMap[v["queueid"]].count += v["count"]
        }
        return GameCountsMap
    }

    static GetDailyWinRaitoMap(data: any): IChartData[] {
        var GameResultsByQueueids: { [name: string]: any } = {}
        var ResultChartData = []
        var totalGameCount = 0
        var totalWinCount = 0
        var GameCountWithoutQueueID: { [name: number]: any } = {}
        var GameWinChartData = []
        var date = new Date()
        for (var v of data) {
            date.setFullYear(v["year"])
            date.setMonth(v["month"] - 1)
            date.setDate(v["day"])
            totalWinCount += v["win"]
            totalGameCount += v["count"]
            if (GameCountWithoutQueueID[date.getTime()] == undefined) {
                GameCountWithoutQueueID[date.getTime()] = { win: 0, count: 0 }
            }
            GameCountWithoutQueueID[date.getTime()].win += v["win"]
            GameCountWithoutQueueID[date.getTime()].count += v["count"]
            if (GameResultsByQueueids[v["queueid"]] == undefined) {
                GameResultsByQueueids[v["queueid"]] = []
            }
            GameResultsByQueueids[v["queueid"]].push([date.getTime(), Math.floor(v["win"] / v["count"] * 100)])
        }

        for (const [key] of Object.entries(GameCountWithoutQueueID)) {
            GameWinChartData.push([parseInt(key), Math.floor(totalWinCount / totalGameCount * 100)])
            totalGameCount -= GameCountWithoutQueueID[toInteger(key)].count
            totalWinCount -= GameCountWithoutQueueID[toInteger(key)].win
        }
        ResultChartData.push({ name: "Total", color: "#00c3ff", data: GameWinChartData })
        for (const [key, value] of Object.entries(GameResultsByQueueids)) {
            ResultChartData.push({ name: GameDataUtils.ConvertFromQueueID(key), data: value })
        }
        return ResultChartData
    }



    static GetFrequencyArray(data: any): HeatMapPerYear {
        // TODO(0xdevssh) : Templately, This is hard coded for year 2021.
        // In 2022, It'll not count any values. So We should add proper handling.
        var years = [2021]

        var HeatMapData: { [name: number]: any } = {}
        var totalGames: { [name: number]: number } = {}
        var date = new Date()

        for (var v of data) {
            date.setFullYear(v["year"])
            date.setMonth(v["month"])
            date.setDate(v["day"])

            if (totalGames[date.getTime()] == undefined)
                totalGames[date.getTime()] = 0
            totalGames[date.getTime()] += v.count

        }
        for (var y = 0; y < years.length; y++) {
            var yearData = []
            for (var i = 12; i >= 1; i--) {
                var monthData = []
                for (var j = 1; j <= 31; j++) {
                    date.setFullYear(years[y])
                    date.setMonth(i)
                    date.setDate(j)
                    monthData.push(totalGames[date.getTime()] !== undefined ? totalGames[date.getTime()] : 0)
                }
                yearData.push({ name: i, data: [...monthData] })
            }
            HeatMapData[years[y]] = yearData
        }
        return HeatMapData
    }
}

export default GameDataUtils