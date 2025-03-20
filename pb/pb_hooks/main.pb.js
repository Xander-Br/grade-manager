/// <reference path="../pb_data/types.d.ts" />
onBootstrap((e) => {
  e.next();

  console.log("App initialized!");
});

onRecordCreate((e) => {
  if (!e.record.get("role")) {
    e.record.set("role", "user");
  }
  e.next();
}, "users");

/// <reference path="../pb_data/types.d.ts" />

onRecordCreateRequest(async (e) => {
  // Log for debugging purposes
  console.log("Record create request event:", JSON.stringify(e, null, 2));
  console.log("Auth ID:", e.auth?.id);
  console.log("Record data:", e.record);

  // First, make sure we have an authenticated user
  if (!e.auth?.id) {
    console.error("No authenticated user found for class creation");
    throw new Error("You must be authenticated to create a class");
  }

  try {
    // Allow the original record creation to proceed
    await e.next();

    // After the class has been created successfully, create the class_members entry
    const classId = e.record.id;
    const userId = e.auth.id;

    const classMembers = e.app.findCollectionByNameOrId("class_members");

    // Create a new class member record
    const memberRecord = new Record(classMembers);
    memberRecord.set("class", classId);
    memberRecord.set("user", userId);
    memberRecord.set("role", "owner");
    memberRecord.set("joined", new Date().toISOString());

    // Save the class member record
    await e.app.save(memberRecord);

    console.log(
      `Created class_members entry: class=${classId}, user=${userId}, role=owner`
    );

    // Don't call e.next() a second time - it's already been called
  } catch (err) {
    console.error("Failed during class creation process:", err);
    //Delete the class if the class_members record creation fails
    await e.app.delete(e.record);
    throw err; // Re-throw to abort the request
  }
}, "classes"); // Only trigger for "classes" collection
