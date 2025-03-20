/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    // Create a "role" field in the Users collection
    const usersCollection = app.findCollectionByNameOrId("users");

    // Add the role field with admin and user options
    usersCollection.fields.add(
      new SelectField({
        system: false,
        id: "user_role",
        name: "role",
        type: "select",
        required: true,
        values: ["admin", "user"],
        maxSelect: 1,
      })
    );

    app.save(usersCollection);

    // Set default value to 'user' for all existing users
    app
      .db()
      .newQuery(
        "UPDATE users SET role = 'user' WHERE role IS NULL OR role = ''"
      )
      .execute();
  },
  (app) => {
    // Revert changes - remove the role field
    const usersCollection = app.dao().findCollectionByNameOrId("users");
    usersCollection.schema.removeField("user_role");

    return app.dao().saveCollection(usersCollection);
  }
);
