import FloatingWindow from '../../components/FloatingWindow';
import { useRouter } from 'next/router';

export default function Character() {
  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();
    router.push(`/character/${event.target.name.value}`);
  }

  return (
    <FloatingWindow header="Search Character">
      <form role="form" className="form-horizontal" onSubmit={handleSubmit}>
        <div className="form-inline">
          <label className="col-lg-2 control-label">Name</label>
          <input
            type="text"
            maxLength={35}
            className="form-control"
            name="name"
            placeholder=""
            required
          />
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
          <button type="reset" className="btn btn-default">
            Cancel
          </button>
        </div>
      </form>
    </FloatingWindow>
  );
}
