import Link from "next/link";

const resources = () => {
    return (
    <div className="flex justify-center">
        <Link href="resources/view-recipes">
          <div className="card card-compact w-96 bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title">Recipes</h2>
                <p>Healthy recipes that anyone can do</p>
                <figure><img src=""></img></figure>
                <div className="card-actions justify-end">
                    <Link href="resources/create-recipe"><button className="btn btn-primary">Create</button></Link>
                </div>
            </div>
          </div>
        </Link>

        <Link href="resources/view-videos">
          <div className="card card-compact w-96 bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title">Videos</h2>
                <p>Follow these videos to improve your fitness</p>
                <figure><img src=""></img></figure>
                <div className="card-actions justify-end">
                    <Link href="resources/create-video"><button className="btn btn-primary">Create</button></Link>
                </div>
            </div>
          </div>
        </Link>
      </div>
    )
}

export default resources