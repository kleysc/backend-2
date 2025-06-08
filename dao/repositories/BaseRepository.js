class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  getAll() {
    return this.model.find();
  }

  getById(id) {
    return this.model.findById(id);
  }

  create(data) {
    return this.model.create(data);
  }

  update(id, data) {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  delete(id) {
    return this.model.findByIdAndDelete(id);
  }
}

module.exports = BaseRepository;
