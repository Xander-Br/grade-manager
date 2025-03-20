/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    // Create classes collection first
    const classCollection = new Collection({
      name: "classes",
      type: "base",
      listRule: "",
      viewRule: "",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.role = 'admin'",
      deleteRule: "@request.auth.role = 'admin'",
      fields: [
        {
          name: "name",
          type: "text",
          required: true,
        },
        {
          name: "description",
          type: "text",
          required: false,
        },
      ],
      indexes: ["CREATE INDEX idx_classes_name ON classes (name)"],
    });

    // Save classes collection first
    app.save(classCollection);
    const classesCollection = app.findCollectionByNameOrId("classes");
    // Now create class_members
    const classMembersCollection = new Collection({
      name: "class_members",
      type: "base",
      listRule: "",
      viewRule: "",
      createRule:
        "@request.auth.role = 'admin' || (user.id = @request.auth.id && role = 'owner')",
      updateRule: "@request.auth.role = 'admin'",
      deleteRule: "@request.auth.role = 'admin'",
      fields: [
        {
          name: "class",
          type: "relation",
          required: true,
          maxSelect: 1,
          collectionId: classesCollection.id, // Use collection name directly
          cascadeDelete: true,
        },
        {
          name: "user",
          type: "relation",
          required: true,
          maxSelect: 1,
          collectionId: "_pb_users_auth_",
          cascadeDelete: true,
        },
        {
          name: "role",
          type: "select",
          required: true,
          values: ["owner", "admin", "member"],
          options: {
            maxSelect: 1,
          },
        },
        {
          name: "joined",
          type: "date",
          required: true,
        },
      ],
      indexes: [
        "CREATE UNIQUE INDEX idx_unique_class_member ON class_members (class, user)",
        "CREATE INDEX idx_class_members_role ON class_members (role)",
      ],
    });

    return app.save(classMembersCollection);
  },
  (app) => {
    // Down migration - delete both collections
    app.delete(app.findCollectionByNameOrId("class_members"));
    return app.delete(app.findCollectionByNameOrId("classes"));
  }
);
