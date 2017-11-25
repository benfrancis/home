var DB = {
  db: null,

  start: function() {
    this.db = new PouchDB('apps');
    this.db.info().then((info) => {
      console.log(info);
      if (info.doc_count === 0) {
        this.populate();
      } else {
        this.db.allDocs({include_docs: true}).then((response) => {
          console.log(response);
        });
      }
    });
  },

  populate: function() {
    console.log('Populating database...');
    fetch('/defaults/apps.json').then((response) => {
      if (!response.ok) {
        console.error('Bad network response while fetching default sites');
        return;
      }
      return response.json();
    }).then((apps) => {
      apps.forEach((app) => {
        var origin = new URL(app.start_url).origin;
        if (app.scope) {
          app._id = origin + app.scope;
        } else {
          app._id = origin;
        }
        console.log('Saving app ' + app._id);
        this.db.put(app);
      });
    }).catch((error) => {
      console.error('Error populating default apps ' + error);
    });
  }
};
