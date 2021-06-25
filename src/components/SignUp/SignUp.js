import './SignUp.scss';

function SignUp(props) {
    return (
        <div className="myModal">
            <div className="modal-dialog mx-0">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title" id="staticBackdropLabel">تسجيل الدخول</h4>
                        <button type="button" className="btn-close" onClick={props.hideSignUpModal}></button>
                    </div>
                    <div className="modal-body p-5">
                        <div>
                            <h4>الدخول إلى الحساب</h4>
                            <form>
                                <div class="mb-3">
                                    <label htmlFor="exampleInputEmail0" class="form-label">البريد الإلكتروني :</label>
                                    <input type="email" className="form-control" id="exampleInputEmail0" aria-describedby="emailHelp"/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="exampleInputPassword0" className="form-label">الرقم السري :</label>
                                    <input type="password" className="form-control" id="exampleInputPassword0"/>
                                </div>
                                <button type="submit" className="btn btn-primary">الدخول</button>
                            </form>
                        </div>
                        <div>
                        <h4>إنشاء حساب جديد</h4> 
                        <form>
                                <div className="mb-3">
                                    <label htmlFor="exampleInputEmail0" className="form-label">إسم المستخدم :</label>
                                    <input type="text" className="form-control" id="exampleInputEmail0" aria-describedby="emailHelp"/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="exampleInputEmail1" className="form-label">البريد الإلكتروني :</label>
                                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="exampleInputPassword1" className="form-label">الرقم السري :</label>
                                    <input type="password" className="form-control" id="exampleInputPassword1"/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="exampleInputPassword2" className="form-label">تأكيد الرقم السري :</label>
                                    <input type="password" className="form-control" id="exampleInputPassword2"/>
                                </div>
                                <button type="submit" className="btn btn-primary">التسجيل</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
      </div>
      );
}

export default SignUp;