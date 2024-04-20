try {

} catch(err) {
    console.log(err);
    res.status(500).json("Internal Error");
}