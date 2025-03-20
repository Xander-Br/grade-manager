migrate(
  (app) => {
    let superusers = app.findCollectionByNameOrId("_superusers");

    let record = new Record(superusers);

    // note: the values can be eventually loaded via $os.getenv(key)
    // or from a special local config file
    record.set("email", "");
    record.set("password", "");

    app.save(record);

    let settings = app.settings();

    settings.meta.appName = "Grade Manager";
    settings.meta.appURL = "https://xndr.ch";
    settings.logs.maxDays = 2;
    settings.logs.logAuthId = true;
    settings.logs.logIP = false;

    app.save(settings);
  },
  (app) => {
    // optional revert operation
    try {
      let record = app.findAuthRecordByEmail("_superusers", "test@example.com");
      app.delete(record);
    } catch {
      // silent errors (probably already deleted)
    }
  }
);
