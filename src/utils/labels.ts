const labelMap : Map<string, string> = new Map([
    ['fL', "Far Left"],
    ['L', "Left"],
    ['C', "Center"],
    ['AW', "Anti-woke"],
    ['R', "Right"],
    ["fR", "Far Right"]
])

const youTubeMap : Map<string, string> = new Map([
    ['Ext URL', "External URL"],
    ['HP', "Homepage"],
    ['Other', "Other"],
    ['Search', "Search"],
    ['User/Channel', "User or Channel"],
    ["Video", "Video"]
])

const channelMap :  Map<string, string> = new Map([
    ['channel_name', "Channel"],
    ['cluster', "Cluster"],
    ['subscribers', "Subscribers"],
    ['total_views', "Views"],
    ['total_videos', "Videos"]
])

export default labelMap;
export { youTubeMap, channelMap };