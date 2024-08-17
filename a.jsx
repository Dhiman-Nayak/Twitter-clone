<div className="m-0 ">
<div className='max-w-screen-xl mx-auto flex h-[calc(100vh-150px)] px-10'>
    <div className='flex-1 hidden lg:flex items-center  justify-center'>
        <XSvg className=' lg:w-2/3 fill-white' />
    </div>
    <div className='flex-1 flex flex-col justify-center items-center'>
        <form className='lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit}>
            <XSvg className='w-24 lg:hidden fill-white' />
            <h1 className='text-4xl font-extrabold text-white'>Join today.</h1>
            <label className='input input-bordered rounded flex items-center gap-2'>
                <MdOutlineMail />
                <input
                    type='email'
                    className='grow'
                    placeholder='Email'
                    name='email'
                    onChange={handleInputChange}
                    value={formData.email}
                />
            </label>
            <div className='flex gap-4 flex-wrap'>
                <label className='input input-bordered rounded flex items-center gap-2 flex-1'>
                    <FaUser />
                    <input
                        type='text'
                        className='grow '
                        placeholder='userName'
                        name='userName'
                        onChange={handleInputChange}
                        value={formData.userName}
                    />
                </label>
                <label className='input input-bordered rounded flex items-center gap-2 flex-1'>
                    <MdDriveFileRenameOutline />
                    <input
                        type='text'
                        className='grow'
                        placeholder='Full Name'
                        name='fullName'
                        onChange={handleInputChange}
                        value={formData.fullName}
                    />
                </label>
            </div>
            <label className='input input-bordered rounded flex items-center gap-2'>
                <MdPassword />
                <input
                    type='password'
                    className='grow'
                    placeholder='Password'
                    name='password'
                    onChange={handleInputChange}
                    value={formData.password}
                />
            </label>
            <button className='btn rounded-full btn-primary text-white'>Sign up</button>
            {isError && <p className='text-red-500'>Something went wrong</p>}
        </form>
        <div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
            <p className='text-white text-lg'>Already have an account?</p>
            <Link to='/login'>
                <button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign in</button>
            </Link>
        </div>
    </div>
    </div>
    <div className=" text-sm m-0">
        <nav className="mx-auto md:mx-20 flex flex-wrap mt-4  gap-3 text-red-50">
            <a>
                <span>About</span>
            </a>
            <a>
                <span>Download the X app</span>
            </a>
            <a>
                <span>Help Center</span>
            </a>
            <a>
                <span>Terms of Service</span>
            </a>
            <a>
                <span>Privacy Policy</span>
            </a>
            <a>
                <span>Cookie Policy</span>
            </a>
            <a>
                <span>Accessibility</span>
            </a>
            <a>
                <span>Ads info</span>
            </a>
            <a>
                <span>Blog</span>
            </a>
            <a>
                <span>Careers</span>
            </a>
            <a>
                <span>Brand Resources</span>
            </a>
            <a>
                <span>Advertising</span>
            </a>
            <a>
                <span>Marketing</span>
            </a>
            <a>
                <span>X for Business</span>
            </a>
            <a>
                <span>Developers</span>
            </a>
            <a>
                <span>Directory</span>
            </a>
            <a>
                <span>Settings</span>
            </a>
            <div>
                <span>© 2024 X Corp.</span>
            </div>
        </nav>

    </div>
</div>