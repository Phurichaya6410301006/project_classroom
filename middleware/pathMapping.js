module.exports.pathMapping = ({shortPath, hostname}) => {
    if (shortPath  == undefined || shortPath == null) return null;
    if (!(shortPath || "").includes("http")) {
      var path = `http://localhost:3000/file_resource${shortPath.split("/public/data/uploads")[1]}`;
      return path;
    }
    return shortPath.split("/public/data/uploads")[1];
};