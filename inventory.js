db.getMongo().getDBNames().forEach(function (d) {
    if ( ! ["admin","config","local"].includes(d) ) {
        db.getSiblingDB(d).getCollectionNames().forEach(function (c) {
            try{
                var coll = db.getSiblingDB(d).getCollection(c);
                var s = coll.stats();
                var detail = {
                    name: s.ns,
                    nbdocs: s.count,
                    size: s.size,
                    avgsize: s.avgObjSize,
                    oldest: coll.findOne({_id:{$type:"objectId"}})
                };
                if (timestamp = detail.oldest) 
                    detail.oldest = timestamp._id.getTimestamp().getDate()+ "/"+(timestamp._id.getTimestamp().getMonth()+1)+ "/"+timestamp._id.getTimestamp().getFullYear();
                else 
                    detail.oldest = "not supported";
                print([ detail.name, (detail.size  / 1024 /1024 / 1024 / 1024).toFixed(2) + 'TB', detail.nbdocs + ' documents', detail.avgsize + ' bytes', detail.oldest ].join(", "));
            }
            catch (err) {
                print(d + "." + c + ", " + err + ", skipping...");
            }
        });
    };
});
