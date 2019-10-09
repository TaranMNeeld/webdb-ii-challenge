
exports.up = function (knex) {
    //the change we want to make to our schema
    return knex.schema.createTable('cars', tbl => {
        tbl.increments();
        tbl.text('name', 128)
            .unique()
            .notNullable();
        tbl.text('year', 4);
        tbl.text('make', 128);
        tbl.text('model', 128);
    })
};

exports.down = function (knex) {
    //undoing that change
    return knex.schema.dropTableIfExists('cars');
};
